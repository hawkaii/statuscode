# 🚨 Railway Deployment Troubleshooting

## Docker Registry Connection Issues

### Problem: `context canceled: context canceled`
This is a common Railway issue caused by Docker registry timeouts during image pulls.

### Solutions (try in order):

### 1. **Use Alpine Dockerfile** (Recommended)
```bash
# Use the optimized Dockerfile (already updated)
railway up
```

### 2. **Try Ubuntu Alternative**
```bash
# If Alpine has compatibility issues, use Ubuntu base
cp Dockerfile.ubuntu Dockerfile
railway up
```

### 3. **Use Minimal Dependencies**
```bash
# Use minimal requirements for faster builds
cp requirements.minimal.txt requirements.txt
railway up
```

### 4. **Deploy via GitHub Integration** (Most Reliable)
```bash
# Push to GitHub first
git init
git add .
git commit -m "UniCompass unified server"
git remote add origin https://github.com/yourusername/unicompass-backend.git
git push -u origin main

# Then deploy via Railway dashboard:
# 1. Go to railway.app
# 2. New Project → Deploy from GitHub repo
# 3. Select your repository
# 4. Railway will build automatically
```

### 5. **Manual Railway CLI with Retry**
```bash
# Clear Railway cache and retry
railway logout
railway login
rm -rf .railway
railway up --detach

# If it fails, wait 2-3 minutes and try again
railway up
```

### 6. **Environment-Specific Dockerfile**
Create a Railway-optimized Dockerfile:

```dockerfile
FROM python:3.11-alpine
WORKDIR /app
RUN apk add --no-cache gcc musl-dev
COPY requirements.txt .
RUN pip install --no-cache-dir --timeout 120 -r requirements.txt
COPY . .
RUN adduser -D app && chown -R app:app /app
USER app
EXPOSE 5000
CMD ["python", "app.py"]
```

## Common Railway Issues & Fixes

### **Build Timeout**
- **Cause**: Large dependencies taking too long to install
- **Fix**: Use `requirements.minimal.txt` and add AI libraries later

### **Memory Issues During Build** 
- **Cause**: Heavy packages like numpy, tensorflow
- **Fix**: Increase Railway memory limit in project settings

### **Port Binding Issues**
- **Cause**: Railway expects app to bind to `$PORT` environment variable
- **Fix**: Already handled in `app.py` - uses `os.environ.get('PORT', 5000)`

### **Missing Dependencies**
- **Cause**: Some packages missing for AI functionality
- **Fix**: Install individually after basic deployment works:

```bash
# After basic deployment works, add one by one:
# 1. Add groq==0.4.1 to requirements.txt
# 2. railway up
# 3. Add azure-ai-formrecognizer==3.3.0
# 4. railway up  
# 5. Add google-generativeai==0.3.2
```

## Alternative Deployment Strategies

### **Strategy 1: Minimal First Deploy**
```bash
# 1. Deploy with minimal requirements
cp requirements.minimal.txt requirements.txt
railway up

# 2. Test basic functionality
python deploy_test.py https://your-app.railway.app

# 3. Gradually add AI dependencies
```

### **Strategy 2: Local Docker Test**
```bash
# Test Docker build locally first
docker build -t unicompass .
docker run -p 5000:5000 -e PORT=5000 unicompass

# If local build works, Railway should work too
```

### **Strategy 3: Railway Template**
```bash
# Use Railway's Python template as base
railway new --template python
# Then copy your code into the template structure
```

## Success Indicators

✅ **Build Succeeds**: No more registry timeout errors  
✅ **Health Check**: `https://your-app.railway.app/health` returns 200  
✅ **Endpoints Work**: Basic endpoints respond correctly  
✅ **Services Load**: Individual service health checks pass  

## Quick Debug Commands

```bash
# Check Railway logs
railway logs

# Check deployment status  
railway status

# Redeploy from scratch
railway down
railway up

# Check environment variables
railway variables
```

## Last Resort: Manual Railway Setup

1. **Create empty Railway project**
2. **Add environment variables manually**
3. **Connect GitHub repository**  
4. **Let Railway auto-deploy from GitHub**
5. **Monitor build logs in dashboard**

This approach bypasses CLI issues and uses Railway's web interface entirely.

---

**💡 Pro Tip**: The Alpine-based Dockerfile should resolve most connection issues. If problems persist, use the GitHub integration method as it's the most reliable for Railway deployments.