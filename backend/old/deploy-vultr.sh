#!/bin/bash

# Vultr UniCompass Deployment Script
# This script automates the deployment process on a Vultr VPS

set -e

echo "🚀 Starting UniCompass deployment on Vultr..."

# Configuration
PROJECT_NAME="unicompass"
DOMAIN=${DOMAIN:-"your-domain.com"}
EMAIL=${EMAIL:-"admin@your-domain.com"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system
log_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
log_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    log_success "Docker installed successfully"
else
    log_info "Docker already installed"
fi

# Install Docker Compose
log_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose installed successfully"
else
    log_info "Docker Compose already installed"
fi

# Install additional tools
log_info "Installing additional tools..."
sudo apt install -y curl wget git htop ufw fail2ban nginx-utils

# Setup firewall
log_info "Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp  # API Gateway
sudo ufw allow 3000/tcp  # Frontend (temporary)
echo "y" | sudo ufw enable

# Create project directory
log_info "Setting up project directory..."
mkdir -p /home/$USER/unicompass
cd /home/$USER/unicompass

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
log_info "Server IP: $SERVER_IP"

# Create environment file
log_info "Creating environment file..."
cat > .env << EOF
# Database Configuration
POSTGRES_PASSWORD=unicompass_prod_2024_$(openssl rand -hex 8)

# API Keys (REPLACE WITH YOUR ACTUAL KEYS)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
DOCUMENTINTELLIGENCE_ENDPOINT=your_azure_endpoint_here
DOCUMENTINTELLIGENCE_API_KEY=your_azure_api_key_here

# Security
JWT_SECRET=$(openssl rand -hex 32)

# Server Configuration
VULTR_SERVER_IP=$SERVER_IP
DOMAIN=$DOMAIN
NODE_ENV=production
FLASK_ENV=production
EOF

log_warning "Please edit .env file with your actual API keys!"

# Clone or copy project files (assuming they're already present)
if [ ! -f "docker-compose.vultr.yml" ]; then
    log_error "docker-compose.vultr.yml not found. Please copy your project files to $(pwd)"
    exit 1
fi

# Create required Dockerfiles if not present
create_dockerfile() {
    local service=$1
    local port=$2
    local requirements=${3:-"requirements.txt"}
    
    if [ ! -f "$service/Dockerfile" ]; then
        log_info "Creating Dockerfile for $service..."
        cat > $service/Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY $requirements .
RUN pip install --no-cache-dir -r $requirements

# Copy application code
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \\
    CMD curl -f http://localhost:$port/health || exit 1

EXPOSE $port

CMD ["python", "app.py"]
EOF
        log_success "Dockerfile created for $service"
    fi
}

# Create Dockerfiles for services
create_dockerfile "orchestrator" "5000"
create_dockerfile "prediction_agent" "5002"
create_dockerfile "resume_agent" "5001"
create_dockerfile "sop_agent" "5003"

# Create frontend Dockerfile if not present
if [ ! -f "sop_agent/frontend/Dockerfile" ]; then
    log_info "Creating Dockerfile for frontend..."
    cat > sop_agent/frontend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \\
    CMD curl -f http://localhost:3000 || exit 1

EXPOSE 3000

CMD ["npm", "start"]
EOF
    log_success "Frontend Dockerfile created"
fi

# Create nginx logs directory
sudo mkdir -p /var/log/nginx

# Build and start services
log_info "Building and starting services..."
docker-compose -f docker-compose.vultr.yml build --no-cache
docker-compose -f docker-compose.vultr.yml up -d

# Wait for services to be healthy
log_info "Waiting for services to be healthy..."
sleep 30

# Check service health
check_service() {
    local name=$1
    local url=$2
    
    if curl -f -s "$url" > /dev/null; then
        log_success "$name is healthy"
        return 0
    else
        log_error "$name is not responding"
        return 1
    fi
}

log_info "Checking service health..."
check_service "Frontend" "http://localhost:3000"
check_service "API Gateway" "http://localhost:5000/api/health"
check_service "Nginx" "http://localhost:80/health"

# Setup SSL with Let's Encrypt (if domain is provided)
setup_ssl() {
    if [ "$DOMAIN" != "your-domain.com" ]; then
        log_info "Setting up SSL certificate for $DOMAIN..."
        
        # Install certbot
        sudo apt install -y certbot python3-certbot-nginx
        
        # Get certificate
        sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive
        
        log_success "SSL certificate installed for $DOMAIN"
    else
        log_warning "Domain not configured. Skipping SSL setup."
    fi
}

# Setup monitoring script
log_info "Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash

# Simple monitoring script for UniCompass services
services=("unicompass-frontend" "unicompass-orchestrator" "unicompass-sop" "unicompass-resume" "unicompass-prediction" "unicompass-db")

echo "=== UniCompass Service Status ==="
for service in "${services[@]}"; do
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q $service; then
        status=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep $service | awk '{print $2}')
        echo "✅ $service: $status"
    else
        echo "❌ $service: Not running"
    fi
done

echo ""
echo "=== Resource Usage ==="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "=== Disk Usage ==="
df -h /
EOF

chmod +x monitor.sh
log_success "Monitoring script created (run ./monitor.sh)"

# Create backup script
log_info "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Creating backup for $DATE..."

# Backup database
docker exec unicompass-db pg_dump -U postgres unicompass > $BACKUP_DIR/db_backup_$DATE.sql

# Backup environment
cp .env $BACKUP_DIR/env_backup_$DATE

# Backup docker-compose
cp docker-compose.vultr.yml $BACKUP_DIR/

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "env_backup_*" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x backup.sh
log_success "Backup script created (run ./backup.sh)"

# Setup log rotation
log_info "Setting up log rotation..."
sudo tee /etc/logrotate.d/unicompass << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        docker exec unicompass-nginx nginx -s reload
    endscript
}
EOF

# Final setup tasks
log_info "Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "0 2 * * * cd /home/$USER/unicompass && ./backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * cd /home/$USER/unicompass && ./monitor.sh >> monitor.log") | crontab -

log_success "Cron jobs configured (daily backups, 5-minute monitoring)"

# Display final information
echo ""
echo "==================== DEPLOYMENT COMPLETE ===================="
log_success "UniCompass is now deployed on Vultr!"
echo ""
echo "🌐 Frontend URL: http://$SERVER_IP (or https://$DOMAIN if SSL configured)"
echo "🔧 API Gateway: http://$SERVER_IP:5000/api/health"
echo "📊 Monitor services: ./monitor.sh"
echo "💾 Create backup: ./backup.sh"
echo ""
echo "📝 IMPORTANT NEXT STEPS:"
echo "1. Edit .env file with your actual API keys"
echo "2. Configure your domain DNS to point to $SERVER_IP"
echo "3. Run 'setup_ssl' function if using a custom domain"
echo "4. Test all endpoints: http://$SERVER_IP/api/health"
echo ""
echo "🔧 Useful Commands:"
echo "  - View logs: docker-compose -f docker-compose.vultr.yml logs -f [service]"
echo "  - Restart services: docker-compose -f docker-compose.vultr.yml restart"
echo "  - Update services: docker-compose -f docker-compose.vultr.yml pull && docker-compose -f docker-compose.vultr.yml up -d"
echo "  - Stop all: docker-compose -f docker-compose.vultr.yml down"
echo ""
echo "💡 Remember to update your frontend environment variable:"
echo "   NEXT_PUBLIC_API_BASE_URL=http://$SERVER_IP:5000"
echo ""
log_success "Happy hacking! 🎉"
EOF