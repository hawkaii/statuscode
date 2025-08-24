# Quick Docker Deployment Guide for Vultr Server

## Method 1: Using the Deployment Script

1. Copy the `deploy-vultr.sh` script to your Vultr server:
```bash
scp deploy-vultr.sh root@139.84.170.181:/root/
```

2. SSH into your server and run the script:
```bash
ssh root@139.84.170.181
chmod +x deploy-vultr.sh
./deploy-vultr.sh
```

## Method 2: Manual Docker Deployment

1. SSH into your Vultr server:
```bash
ssh root@139.84.170.181
```

2. Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
```

3. Clone your repository:
```bash
git clone <YOUR_REPO_URL> /opt/unicompass
cd /opt/unicompass/backend
```

4. Create production environment file:
```bash
cp .env.production .env
nano .env  # Edit with your API keys
```

5. Build and run:
```bash
docker build -t unicompass-backend .
docker run -d --name unicompass --restart unless-stopped -p 80:5000 --env-file .env unicompass-backend
```

## Method 3: Using Docker Compose (Recommended)

1. After cloning the repository:
```bash
cd /opt/unicompass/backend
cp .env.production .env
nano .env  # Edit with your API keys
```

2. Deploy with Docker Compose:
```bash
docker-compose up -d
```

## Verify Deployment

```bash
# Check container status
docker ps

# Check logs
docker logs unicompass

# Test API
curl http://139.84.170.181/health
```

## Your API Endpoints

Once deployed, your API will be available at:
- Base URL: `http://139.84.170.181`
- Health Check: `http://139.84.170.181/health`
- All endpoints from your ENDPOINT_USAGE.md

## Maintenance Commands

```bash
# Update application
cd /opt/unicompass && git pull
docker-compose down && docker-compose up -d --build

# View logs
docker logs -f unicompass

# Restart service
docker restart unicompass
```