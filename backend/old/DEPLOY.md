# UniCompass Backend - Ubuntu Server Deployment Guide

## 🚀 Quick Deploy to Ubuntu Server

### Step 1: SSH into Your Server
```bash
ssh username@your-server-ip
```

### Step 2: Run Server Setup
```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/your-repo/unicompass/main/backend/server-setup.sh -o setup.sh
chmod +x setup.sh
./setup.sh

# OR if you already have the code:
cd /path/to/unicompass/backend
./server-setup.sh
```

### Step 3: Get Your Code on Server
```bash
# Option A: Clone from GitHub
cd /opt/unicompass
git clone https://github.com/your-username/unicompass.git .

# Option B: Upload via SCP from local machine
scp -r ./backend username@your-server-ip:/opt/unicompass
```

### Step 4: Configure Environment
```bash
cd /opt/unicompass/backend
cp .env.example .env
nano .env  # Edit your configuration
```

### Step 5: Deploy!
```bash
./deploy.sh
```

---

## 📋 Manual Step-by-Step Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login for Docker permissions to take effect
exit
```

### 3. Setup Firewall
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000:5003/tcp
```

### 4. Clone Repository
```bash
sudo mkdir -p /opt/unicompass
sudo chown $USER:$USER /opt/unicompass
cd /opt/unicompass
git clone <YOUR_REPO_URL> .
```

### 5. Configure Environment
```bash
cd /opt/unicompass/backend
cp .env.example .env
nano .env
```

**Required Configuration:**
```env
# Change these values:
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key  # Optional but recommended
```

### 6. Deploy Services
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 7. Verify Deployment
```bash
# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# Test API endpoints
curl http://localhost:5000/api/health
curl http://localhost:5002/health
curl http://localhost:5001/health
curl http://localhost:5003/api/health
```

---

## 🔧 Management Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f orchestrator
```

### Restart Services
```bash
# All services
docker-compose -f docker-compose.prod.yml restart

# Specific service
docker-compose -f docker-compose.prod.yml restart orchestrator
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Update Deployment
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🌐 Access Your API

Once deployed, your API will be available at:

- **API Gateway**: `http://YOUR_SERVER_IP:5000`
- **Health Check**: `http://YOUR_SERVER_IP:5000/api/health`
- **API Documentation**: See `API.md` for all endpoints

### Test Commands:
```bash
# Replace YOUR_SERVER_IP with your actual server IP
SERVER_IP="your.server.ip"

# Health check
curl http://$SERVER_IP:5000/api/health

# University prediction
curl -X POST http://$SERVER_IP:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"gre": 320, "toefl": 110, "gpa": 3.8}'

# Resume analysis
curl -X POST http://$SERVER_IP:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "John Doe Software Engineer..."}'
```

---

## 🔒 Security Notes

1. **Change default passwords** in `.env` file
2. **Firewall is configured** to only allow necessary ports
3. **Consider SSL** for production (add nginx with Let's Encrypt)
4. **Regular updates** - keep Docker and system updated

---

## 🆘 Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check system resources
docker system df
free -h
df -h
```

### Port Already in Use
```bash
# Find what's using the port
sudo netstat -tlnp | grep :5000

# Kill the process if needed
sudo kill -9 <PID>
```

### Database Connection Issues
```bash
# Check postgres logs
docker-compose -f docker-compose.prod.yml logs postgres

# Connect to database directly
docker-compose -f docker-compose.prod.yml exec postgres psql -U unicompass_user -d unicompass_db
```

---

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Ensure all environment variables are set correctly
3. Verify firewall settings allow the necessary ports
4. Make sure Docker has sufficient resources