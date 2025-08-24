#!/bin/bash
set -e

echo "🚀 UniCompass Backend Server Setup"
echo "=================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose already installed"
fi

# Install Git
echo "📝 Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install git -y
    echo "✅ Git installed successfully"
else
    echo "✅ Git already installed"
fi

# Install UFW (Firewall)
echo "🔒 Configuring firewall..."
sudo apt install ufw -y
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000:5003/tcp  # Backend services for development
echo "✅ Firewall configured"

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p /opt/unicompass
sudo chown $USER:$USER /opt/unicompass
cd /opt/unicompass

# Clone repository (you'll need to provide the repo URL)
echo "📥 Ready to clone repository..."
echo ""
echo "Next steps:"
echo "1. Clone your repository to /opt/unicompass:"
echo "   git clone <YOUR_REPO_URL> ."
echo ""
echo "2. Copy environment file:"
echo "   cp .env.example .env"
echo ""
echo "3. Edit environment variables:"
echo "   nano .env"
echo ""
echo "4. Deploy the application:"
echo "   ./deploy.sh"
echo ""
echo "🎉 Server setup complete!"
echo "💡 Remember to logout and login again to apply Docker permissions"