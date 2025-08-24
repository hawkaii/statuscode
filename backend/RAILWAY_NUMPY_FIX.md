# 🚀 Railway Deployment Strategy - NumPy Issue Fix

## Problem: NumPy Build Failure on Railway
The error occurs because NumPy needs C++ compilation tools that aren't available in minimal Alpine images.

## 🎯 Solution Strategy: Staged Deployment

### Stage 1: Basic Deployment (No NumPy)
Deploy the server without NumPy to get it running first.

```bash
# 1. Use basic requirements (no NumPy)
cp requirements.basic.txt requirements.txt

# 2. Deploy to Railway
railway up
```

**Expected Result**: Basic Flask server runs without prediction functionality.

### Stage 2: Add NumPy Support
Once basic deployment works, add NumPy back.

```bash
# 1. Switch to full requirements
cp requirements.txt requirements.basic.txt  # backup
echo "numpy==1.24.3" >> requirements.txt

# 2. Redeploy
railway up
```

## 🔧 Alternative Dockerfiles

### Option 1: Debian-based (Recommended)
```dockerfile
# Current Dockerfile - uses python:3.11-slim with build tools
FROM python:3.11-slim
# ... includes gcc, g++, gfortran, libopenblas-dev
```

### Option 2: Use Pre-built Wheels
```dockerfile
FROM python:3.11-slim
# Force pip to use pre-built wheels (faster, no compilation)
RUN pip install --only-binary=all numpy==1.24.3
```

### Option 3: Multi-stage Build
```dockerfile
# Build stage
FROM python:3.11 as builder
RUN pip install numpy==1.24.3
# Runtime stage  
FROM python:3.11-slim
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
```

## 🚀 Quick Deploy Commands

### Method 1: Basic First (Recommended)
```bash
# Deploy without NumPy first
cp requirements.basic.txt requirements.txt
railway up

# Test basic endpoints
curl https://your-app.railway.app/health

# Add NumPy later
echo "numpy==1.24.3" >> requirements.txt
railway up
```

### Method 2: GitHub Integration (Most Reliable)
```bash
# Push to GitHub with basic requirements
git add .
git commit -m "Basic deployment without NumPy"
git push

# Deploy via Railway dashboard → GitHub integration
# Then gradually add dependencies via commits
```

### Method 3: Use Railway's Python Template
```bash
# Start with Railway's Python template
railway new --template python

# Copy your code into the template
# Templates often have better dependency handling
```

## 📦 Dependency Management

### Core Dependencies (Always Work):
```txt
Flask==2.3.3
Flask-CORS==4.0.0  
python-dotenv==1.0.0
pydantic==2.4.2
requests==2.31.0
gunicorn==21.2.0
```

### Scientific Dependencies (Add Later):
```txt
numpy==1.24.3          # Needs compilation tools
scipy==1.10.1          # Depends on NumPy
pandas==2.0.3          # Depends on NumPy
```

### AI Dependencies (Add Last):
```txt
groq==0.4.1             # Usually works fine
azure-ai-formrecognizer # May have additional deps
google-generativeai     # Usually works fine
```

## 🔍 Debug Railway Build Issues

### Check Build Logs:
```bash
# View real-time build logs
railway logs --follow

# Check specific build failure
railway logs | grep -A 10 -B 10 "ERROR"
```

### Test Locally First:
```bash
# Build Docker image locally
docker build -t unicompass-test .

# Run locally to test
docker run -p 5000:5000 -e PORT=5000 unicompass-test

# If local works, Railway should work
```

## ✅ Success Validation

After deployment, test these endpoints:

```bash
BASE_URL="https://your-app.railway.app"

# Basic health
curl $BASE_URL/health

# Service health  
curl $BASE_URL/api/prediction/health

# Basic prediction (should work without NumPy)
curl -X POST $BASE_URL/api/prediction/predict_universities \
  -H "Content-Type: application/json" \
  -d '{"gpa":3.5,"target_program":"computer science"}'
```

## 🎯 Recommended Approach

1. **Deploy Basic Version First** using `requirements.basic.txt`
2. **Verify Core Functionality** with health checks
3. **Add NumPy Gradually** and test each addition
4. **Add AI Dependencies Last** once NumPy works

This staged approach ensures you get a working deployment quickly, then add complexity incrementally.

---

**💡 The key insight**: Railway deployment failures are often due to trying to install everything at once. Break it down into stages for better success rates!