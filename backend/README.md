# UniCompass Unified Backend

## 🚀 Quick Start

### Local Development
```bash
# Clone and setup
cd backend-unified
cp .env.example .env
nano .env  # Edit your configuration

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
```

### Production Deployment
```bash
# One-command deploy
./deploy.sh
```

## 📡 API Endpoints

**Base URL:** `http://localhost:5000`

### Health Check
```bash
GET /api/health
```

### University Prediction
```bash
POST /api/predict
Content-Type: application/json

{
  "gre": 320,
  "toefl": 110,
  "gpa": 3.8
}
```

### Resume Analysis
```bash
POST /api/analyze
Content-Type: application/json

{
  "resume_text": "Your resume text here..."
}
```

### SOP Review
```bash
POST /api/review
Content-Type: application/json

{
  "user_id": "user123",
  "draft": "My statement of purpose..."
}
```

### SOP Examples
```bash
GET /api/examples
```

### SOP History
```bash
GET /api/history?user_id=user123
```

## 🔧 Configuration

### Required Environment Variables
- `SECRET_KEY` - Flask secret key
- `DEBUG` - true/false for development/production

### Optional Environment Variables
- `GEMINI_API_KEY` - For enhanced SOP feedback
- `OPENAI_API_KEY` - For enhanced resume analysis
- `POSTGRES_*` - Database configuration for persistence
- `DOCUMENTINTELLIGENCE_*` - Azure OCR for PDF processing

## 🐳 Docker Deployment

```bash
# Build image
docker build -t unicompass-backend .

# Run container
docker run -p 5000:5000 --env-file .env unicompass-backend
```

## 🌐 Ubuntu Server Deployment

```bash
# SSH to your server
ssh user@your-server-ip

# Clone repository
git clone <your-repo> /opt/unicompass
cd /opt/unicompass/backend-unified

# Configure
cp .env.example .env
nano .env

# Deploy
./deploy.sh
```

## 📊 Features

- ✅ **University Prediction** - ML-based university recommendations
- ✅ **Resume Analysis** - ATS scoring and feedback
- ✅ **SOP Review** - AI-powered statement review
- ✅ **Health Monitoring** - Service status and metrics
- ✅ **Caching** - Performance optimization
- ✅ **Error Handling** - Graceful error responses
- ✅ **CORS Support** - Frontend integration ready

## 🛠️ Architecture

```
backend-unified/
├── app.py                 # Main Flask application
├── routes/                # API route blueprints
│   ├── health.py         # Health check endpoints
│   ├── prediction.py     # University prediction
│   ├── resume.py         # Resume analysis
│   └── sop.py           # SOP review/suggestions
├── services/             # Business logic services
│   ├── prediction_service.py
│   ├── resume_service.py
│   └── sop_service.py
├── config/               # Configuration modules
└── requirements.txt      # Python dependencies
```

This unified backend provides all UniCompass features in a single, easy-to-deploy Flask application!