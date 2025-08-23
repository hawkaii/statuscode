# UniCompass Vultr Deployment Plan

## Overview

This deployment plan provides a complete strategy for deploying UniCompass on Vultr VPS, with focus on exposing the correct API endpoints through the orchestrator and creating a production-ready environment.

## Current Architecture Analysis

### Frontend API Integration
The existing Next.js frontend (`sop_agent/frontend/`) is configured to call:
- **Base URL**: `http://localhost:5003` (SOP Agent direct)
- **Endpoints Used**:
  - `POST /api/review` - SOP review with Gemini AI
  - `GET /api/history` - User review history
  - `GET /api/examples` - SOP examples
  - `PATCH /api/suggest` - SOP suggestions
  - `GET /api/health` - Health check

### Backend Services
- **Orchestrator** (Port 5000) - API Gateway (needs SOP endpoint proxies)
- **SOP Agent** (Port 5003) - Main service with database and Gemini AI
- **Resume Agent** (Port 5001) - Resume analysis with OpenAI/Azure OCR
- **Prediction Agent** (Port 5002) - University predictions
- **PostgreSQL** - Database for SOP history and embeddings

## Phase 1: API Gateway Enhancement

### 1.1 Orchestrator Updates ✅ COMPLETED
Added proxy endpoints to route frontend requests through orchestrator:

```python
# New orchestrator endpoints
@app.route('/api/review', methods=['POST', 'OPTIONS'])     # Proxy to SOP Agent
@app.route('/api/suggest', methods=['PATCH', 'OPTIONS'])   # Proxy to SOP Agent  
@app.route('/api/examples', methods=['GET', 'OPTIONS'])    # Proxy to SOP Agent
@app.route('/api/history', methods=['GET', 'OPTIONS'])     # Proxy to SOP Agent
@app.route('/api/health', methods=['GET'])                 # Unified health check
```

### 1.2 Frontend Configuration Update
Update frontend API base URL to use orchestrator:

```typescript
// sop_agent/frontend/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
```

## Phase 2: Vultr Deployment Strategy

### 2.1 Server Specifications
**Recommended Vultr VPS**:
- **Plan**: Regular Performance 4GB RAM
- **CPU**: 2 vCPU
- **Storage**: 80GB SSD
- **Bandwidth**: 3TB
- **OS**: Ubuntu 22.04 LTS

### 2.2 Deployment Architecture
```
Internet → Vultr VPS → Nginx (Port 80/443) → Frontend (Port 3000)
                                          ↘ API Gateway (Port 5000) ↘
                                                                   ↘ SOP Agent (Port 5003)
                                                                   ↘ Resume Agent (Port 5001) 
                                                                   ↘ Prediction Agent (Port 5002)
                                                                   ↘ PostgreSQL (Port 5432)
```

### 2.3 Docker Compose Configuration ✅ CREATED

**File**: `docker-compose.vultr.yml`

Services included:
- **Frontend** (Next.js) - Port 3000
- **Orchestrator** (API Gateway) - Port 5000
- **SOP Agent** (Main service) - Port 5003
- **Resume Agent** - Port 5001
- **Prediction Agent** - Port 5002
- **PostgreSQL** - Port 5432
- **Nginx** (Reverse Proxy) - Port 80/443

### 2.4 Nginx Configuration ✅ CREATED

**Features**:
- Reverse proxy to frontend and API
- Rate limiting (10 req/s for API, 30 req/s for frontend)
- CORS handling for API requests
- Static file caching
- Security headers
- Health check endpoint

## Phase 3: Automated Deployment

### 3.1 Deployment Script ✅ CREATED

**File**: `deploy-vultr.sh`

**Features**:
- Automated Docker & Docker Compose installation
- UFW firewall configuration
- Environment file generation with secure secrets
- Automatic Dockerfile creation for all services
- Health checks and monitoring
- SSL setup with Let's Encrypt
- Backup and monitoring scripts
- Log rotation setup

### 3.2 Quick Deployment Steps

```bash
# 1. Get Vultr VPS and note IP address
# 2. SSH into server
ssh root@YOUR_VULTR_IP

# 3. Create user (if not exists)
adduser unicompass
usermod -aG sudo unicompass
su - unicompass

# 4. Copy project files to server
rsync -avz --exclude node_modules --exclude .git . unicompass@YOUR_VULTR_IP:~/unicompass/

# 5. Run deployment script
cd ~/unicompass
chmod +x deploy-vultr.sh
./deploy-vultr.sh
```

### 3.3 Environment Configuration

**Required Environment Variables**:
```bash
# API Keys (MUST BE CONFIGURED)
GEMINI_API_KEY=your_actual_gemini_key
OPENAI_API_KEY=your_actual_openai_key  
DOCUMENTINTELLIGENCE_ENDPOINT=your_azure_endpoint
DOCUMENTINTELLIGENCE_API_KEY=your_azure_key

# Auto-generated
POSTGRES_PASSWORD=auto_generated_secure_password
JWT_SECRET=auto_generated_32_char_secret
VULTR_SERVER_IP=detected_server_ip
```

## Phase 4: SSL and Domain Setup

### 4.1 Domain Configuration
```bash
# Point your domain DNS A record to Vultr IP
# Example: unicompass.com → YOUR_VULTR_IP

# Update environment
export DOMAIN=your-domain.com
export EMAIL=admin@your-domain.com
```

### 4.2 SSL Certificate
```bash
# Automatic SSL setup included in deployment script
sudo certbot --nginx -d your-domain.com --email admin@your-domain.com --agree-tos --non-interactive
```

## Phase 5: Monitoring and Maintenance

### 5.1 Health Monitoring ✅ CREATED

**Monitor Script**: `monitor.sh`
- Container status checks
- Resource usage monitoring
- Health endpoint verification

**Automated Monitoring**:
```bash
# Runs every 5 minutes via cron
*/5 * * * * cd /home/unicompass/unicompass && ./monitor.sh >> monitor.log
```

### 5.2 Backup Strategy ✅ CREATED

**Backup Script**: `backup.sh`
- Daily PostgreSQL database dumps
- Environment file backups
- Docker compose configuration backups
- 7-day retention policy

**Automated Backups**:
```bash
# Daily at 2 AM via cron
0 2 * * * cd /home/unicompass/unicompass && ./backup.sh
```

### 5.3 Useful Commands

```bash
# View service logs
docker-compose -f docker-compose.vultr.yml logs -f [service_name]

# Restart specific service
docker-compose -f docker-compose.vultr.yml restart [service_name]

# Update all services
docker-compose -f docker-compose.vultr.yml pull
docker-compose -f docker-compose.vultr.yml up -d

# Check service health
curl http://YOUR_IP/health

# Database access
docker exec -it unicompass-db psql -U postgres -d unicompass
```

## Phase 6: Security Considerations

### 6.1 Firewall Configuration ✅ IMPLEMENTED
- UFW enabled with strict rules
- Only SSH (22), HTTP (80), HTTPS (443) exposed
- Internal Docker network isolation

### 6.2 Security Headers ✅ IMPLEMENTED
```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff  
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
```

### 6.3 Rate Limiting ✅ IMPLEMENTED
- API endpoints: 10 requests/second
- Frontend: 30 requests/second
- Burst handling configured

### 6.4 JWT Authentication ✅ EXISTING
- Secure JWT secret generation
- Token validation on all API endpoints
- Bearer token authentication

## Phase 7: Production Optimizations

### 7.1 Performance
- **Docker multi-stage builds** for smaller images
- **Nginx static file caching** for frontend assets
- **Database connection pooling**
- **Redis caching layer** (future enhancement)

### 7.2 Logging
- **Centralized logging** with Docker logs
- **Log rotation** configured via logrotate
- **Error tracking** with structured JSON logs

### 7.3 High Availability (Optional)
- **Multiple VPS instances** with load balancer
- **Database replication**
- **Health check automation with restart policies**

## Deployment Timeline

### Day 1: Infrastructure Setup
- [x] Vultr VPS provisioning
- [x] Docker environment configuration
- [x] Security hardening (firewall, fail2ban)

### Day 2: Application Deployment  
- [x] Container orchestration setup
- [x] Database initialization
- [x] Service connectivity testing

### Day 3: Frontend Integration
- [x] API endpoint proxy configuration
- [x] CORS and authentication setup
- [x] End-to-end testing

### Day 4: Production Hardening
- [x] SSL certificate installation
- [x] Monitoring and alerting setup
- [x] Backup automation

### Day 5: Performance Testing
- [ ] Load testing with realistic traffic
- [ ] Performance optimization
- [ ] Documentation and handover

## Troubleshooting Guide

### Common Issues

**1. Frontend can't connect to API**
```bash
# Check if orchestrator is running
docker ps | grep orchestrator

# Test API health
curl http://localhost:5000/api/health

# Check CORS configuration
curl -H "Origin: http://your-domain.com" -I http://localhost:5000/api/health
```

**2. Database connection issues**
```bash
# Check database status
docker exec unicompass-db pg_isready -U postgres

# View database logs
docker-compose -f docker-compose.vultr.yml logs postgres

# Reset database (CAUTION: destroys data)
docker-compose -f docker-compose.vultr.yml down -v
docker-compose -f docker-compose.vultr.yml up -d postgres
```

**3. SSL certificate issues**
```bash
# Test SSL configuration
sudo nginx -t

# Renew certificates
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

### Emergency Recovery

**1. Complete service restart**
```bash
cd ~/unicompass
docker-compose -f docker-compose.vultr.yml down
docker-compose -f docker-compose.vultr.yml up -d
```

**2. Database recovery from backup**
```bash
# List available backups
ls -la ~/backups/

# Restore specific backup
docker exec -i unicompass-db psql -U postgres -d unicompass < ~/backups/db_backup_YYYYMMDD_HHMMSS.sql
```

## Success Metrics

### Technical Metrics
- [ ] All services healthy (5/5 green status)
- [ ] API response time < 2 seconds
- [ ] Frontend load time < 3 seconds
- [ ] Database queries < 100ms average
- [ ] 99%+ uptime over 7 days

### Functional Metrics
- [ ] SOP review functionality working
- [ ] Resume analysis working
- [ ] University prediction working
- [ ] User history persistence working
- [ ] Authentication working

## Post-Deployment Checklist

### Immediate (Day 1)
- [ ] All services running and healthy
- [ ] Frontend accessible via domain/IP
- [ ] API endpoints responding correctly
- [ ] Database connectivity confirmed
- [ ] SSL certificate installed (if using domain)

### Short-term (Week 1)
- [ ] Monitoring alerts configured
- [ ] Backup restoration tested
- [ ] Performance baseline established
- [ ] User acceptance testing completed
- [ ] Documentation updated

### Long-term (Month 1)
- [ ] Security audit completed
- [ ] Performance optimizations implemented
- [ ] Monitoring dashboard created
- [ ] Disaster recovery plan tested
- [ ] Scaling strategy documented

---

## Quick Start Summary

```bash
# 1. Provision Vultr VPS (4GB RAM, Ubuntu 22.04)
# 2. Copy project to server
rsync -avz . user@vultr-ip:~/unicompass/

# 3. Run automated deployment  
ssh user@vultr-ip
cd ~/unicompass
chmod +x deploy-vultr.sh
./deploy-vultr.sh

# 4. Configure API keys in .env file
nano .env

# 5. Restart services with new config
docker-compose -f docker-compose.vultr.yml restart

# 6. Test deployment
curl http://vultr-ip/health
```

**Access Points**:
- **Frontend**: `http://vultr-ip` or `https://your-domain.com`
- **API**: `http://vultr-ip:5000/api/health`
- **Monitoring**: `./monitor.sh`
- **Backups**: `./backup.sh`

---

**Support**: Contact the deployment team with the server IP and any error logs for troubleshooting assistance.