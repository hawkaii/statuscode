# Railway Deployment Guide

## 🚀 Deploy UniCompass to Railway

### Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- API keys for:
  - Groq API (for LLM functionality)
  - Azure Document Intelligence (for OCR)
  - Google Gemini AI (for SOP analysis)

### Quick Deploy

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy from current directory
   railway up
   ```

2. **Set Environment Variables**
   
   Go to your Railway project dashboard and set these variables:

   ```env
   # Required API Keys
   OPENAI_API_KEY=gsk_your_groq_api_key_here
   DOCUMENTINTELLIGENCE_API_KEY=your_azure_doc_intelligence_key
   DOCUMENTINTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Flask Configuration
   DEBUG=false
   SECRET_KEY=your_super_secret_key_here
   
   # Optional Configuration
   OPENAI_MODEL=llama3-8b-8192
   MAX_TOKENS=2000
   TEMPERATURE=0.3
   CACHE_SIZE=128
   LOG_LEVEL=INFO
   ```

### Alternative: GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial UniCompass unified server"
   git remote add origin https://github.com/yourusername/unicompass-backend.git
   git push -u origin main
   ```

2. **Deploy via Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect the Dockerfile

3. **Configure Environment Variables** (same as above)

### Domain Setup

Railway provides a free domain automatically. You can also add a custom domain:

1. Go to your project's **Settings** → **Domains**
2. Click **Generate Domain** for a railway.app subdomain
3. Or click **Custom Domain** to add your own domain

### Monitoring

Railway provides built-in monitoring:
- **Logs**: View real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Track deployment history

Access monitoring via:
- Railway Dashboard → Your Project → **Observability**

### Health Check

The application includes a health endpoint that Railway can use for monitoring:
- **Health Check URL**: `https://your-app.railway.app/health`
- **Status**: Returns service status and dependencies

### Scaling

Railway auto-scales based on usage. For manual scaling:
1. Go to **Settings** → **Resources**
2. Adjust **Memory** and **CPU** limits
3. Enable **Auto-scaling** if needed

### Database

The app uses SQLite by default. For production, consider upgrading to Railway's PostgreSQL:

1. Add PostgreSQL service to your project
2. Update `DATABASE_URL` environment variable
3. Modify database connection in `services/sop_service.py`

### Troubleshooting

**Common Issues:**

1. **Build Failures**
   ```bash
   # Check build logs in Railway dashboard
   # Ensure all dependencies are in requirements.txt
   ```

2. **Environment Variable Issues**
   ```bash
   # Check /health endpoint to see which services are unavailable
   # Verify API keys are set correctly in Railway dashboard
   ```

3. **Port Issues**
   ```bash
   # Railway automatically sets PORT environment variable
   # Application is configured to use $PORT automatically
   ```

4. **Memory Issues**
   ```bash
   # Increase memory limit in Railway settings
   # Default is usually 512MB, consider 1GB+ for AI workloads
   ```

### Production Checklist

✅ **Environment Variables**
- [ ] All API keys configured
- [ ] DEBUG set to false
- [ ] SECRET_KEY is secure

✅ **Security**
- [ ] CORS configured for your frontend domains
- [ ] API keys stored securely in Railway dashboard
- [ ] No secrets in code/logs

✅ **Performance**
- [ ] Gunicorn enabled for production
- [ ] Appropriate memory/CPU limits set
- [ ] Caching enabled

✅ **Monitoring**
- [ ] Health check endpoint working
- [ ] Logs accessible in Railway dashboard
- [ ] Error tracking configured

### API Endpoints

Once deployed, your API will be available at:
```
https://your-app.railway.app/

Endpoints:
- GET  /                              # Service info
- GET  /health                        # Health check
- POST /api/resume/analyze_resume     # Resume analysis
- POST /api/prediction/predict_universities # University predictions
- POST /api/academic/predict          # Academic predictions
- POST /api/sop/analyze              # SOP analysis
- POST /api/analyze                  # Unified analysis
```

### Cost Estimation

Railway's pricing (as of 2024):
- **Free Tier**: $5/month credit included
- **Usage-based**: ~$0.000463/GB-hour for memory
- **Typical costs**: $10-50/month depending on usage

For detailed pricing, visit [railway.app/pricing](https://railway.app/pricing)

### Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: Community support
- **UniCompass Issues**: GitHub repository issues section