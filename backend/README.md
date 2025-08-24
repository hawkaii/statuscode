# UniCompass Unified Backend

A unified Flask server that consolidates all UniCompass agent functionalities into a single application, providing comprehensive university application assistance services.

## Features

### 🎯 Resume Analysis Service
- **OCR Processing**: Extract text from PDF resumes using Azure Document Intelligence
- **Hybrid ATS Scoring**: 100-point scoring system combining traditional metrics and AI insights
- **AI Enhancement**: Groq-powered resume analysis and feedback generation
- **Comprehensive Feedback**: Priority-based actionable recommendations

### 🏫 University Prediction Service  
- **ML-based Predictions**: University admission probability predictions
- **Tiered Recommendations**: Safety, target, and reach school categorization
- **Profile Optimization**: Personalized improvement suggestions
- **Caching System**: Performance-optimized with intelligent caching

### 📝 Academic API Service
- **Bulk Predictions**: Analyze admission chances across 50+ universities
- **Single University Analysis**: Detailed predictions for specific schools
- **Comprehensive Database**: Extended university database with detailed requirements
- **Statistical Summaries**: Aggregate analysis and probability distributions

### ✍️ SOP (Statement of Purpose) Service
- **AI-Powered Analysis**: Gemini AI integration for content analysis
- **Enhancement Suggestions**: Specific improvement recommendations
- **Database Storage**: SQLite-based SOP document management
- **Quality Metrics**: Word count, readability, and structure analysis

## Quick Start

### Prerequisites
- Python 3.8+
- API Keys for:
  - Groq API (for LLM functionality)
  - Azure Document Intelligence (for OCR)
  - Google Gemini AI (for SOP analysis)

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the server**:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### 🏠 General Endpoints
- `GET /` - Service information and available endpoints
- `GET /health` - Unified health check for all services

### 📄 Resume Analysis
- `POST /api/resume/ocr_resume` - Extract text from PDF resume
- `POST /api/resume/analyze_resume` - Comprehensive resume analysis
- `GET /api/resume/health` - Resume service health check
- `GET /api/resume/llm_status` - LLM service status
- `GET /api/resume/ocr_status` - OCR service status

### 🎓 University Prediction
- `POST /api/prediction/predict_universities` - University admission predictions
- `GET /api/prediction/health` - Prediction service health check

### 🏛️ Academic API
- `POST /api/academic/predict` - Bulk university predictions (50+ universities)
- `POST /api/academic/predict_single` - Single university prediction
- `GET /api/academic/health` - Academic API health check

### 📝 Statement of Purpose
- `POST /api/sop/analyze` - Analyze SOP quality and structure
- `POST /api/sop/enhance` - AI-powered SOP enhancement
- `POST /api/sop/save` - Save SOP to database
- `GET /api/sop/load/<sop_id>` - Load SOP from database
- `GET /api/sop/health` - SOP service health check

### 🔄 Unified Analysis (Orchestrator)
- `POST /api/analyze` - Unified analysis endpoint (coordinates all services)

## Example Usage

### Resume Analysis
```bash
curl -X POST http://localhost:5000/api/resume/analyze_resume \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your resume text here...",
    "options": {
      "include_ai_insights": true
    }
  }'
```

### University Prediction
```bash
curl -X POST http://localhost:5000/api/prediction/predict_universities \
  -H "Content-Type: application/json" \
  -d '{
    "gpa": 3.7,
    "gre_verbal": 160,
    "gre_quantitative": 165,
    "research_experience": true,
    "target_program": "computer science"
  }'
```

### Unified Analysis
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "type": "full",
    "resume_text": "Your resume...",
    "profile": {
      "gpa": 3.7,
      "gre_verbal": 160,
      "gre_quantitative": 165
    },
    "sop_text": "Your statement of purpose...",
    "academic_profile": {
      "gpa": 3.7,
      "major": "computer science"
    }
  }'
```

## Architecture

### Microservices Consolidation
The unified server consolidates the following original agents:
- **Resume Agent** (Port 5001) → `/api/resume/*`
- **Prediction Agent** (Port 5002) → `/api/prediction/*` 
- **Academic API** (Port 5003) → `/api/academic/*`
- **SOP Agent** → `/api/sop/*`
- **Orchestrator** (Port 5000) → `/api/analyze`

### Service Structure
```
backend/
├── app.py                 # Main Flask application
├── services/              # Core service implementations
│   ├── resume_service.py
│   ├── prediction_service.py
│   ├── academic_api_service.py
│   └── sop_service.py
├── models/                # Data models and schemas
│   └── data_models.py
├── utils/                 # Utilities and configuration
│   ├── config.py
│   └── logger.py
└── requirements.txt       # Dependencies
```

### Technology Stack
- **Framework**: Flask with CORS support
- **AI Services**: Groq API, Azure Document Intelligence, Google Gemini
- **Database**: SQLite for SOP storage
- **Data Validation**: Pydantic models
- **Caching**: In-memory caching with configurable size
- **Logging**: Centralized logging with file and console output

## Scoring Systems

### Resume ATS Score (100 points total)
- **Keywords** (40 points): Technical and soft skill keywords
- **Action Verbs** (25 points): Strong action verbs usage
- **Length** (20 points): Optimal word count (300-800 words)
- **Format** (15 points): Structure and completeness

### University Prediction Scoring
- **GPA Factor** (35%): Academic performance weight
- **GRE Scores** (25%): Standardized test performance  
- **Language Tests** (10%): TOEFL/IELTS scores
- **Research Experience** (15%): Publications and research background
- **Work Experience** (10%): Professional experience
- **Program Fit** (5%): Target program alignment

## Environment Variables

Required environment variables (see `.env.example`):
- `OPENAI_API_KEY`: Groq API key for LLM functionality
- `DOCUMENTINTELLIGENCE_API_KEY`: Azure Document Intelligence key
- `DOCUMENTINTELLIGENCE_ENDPOINT`: Azure service endpoint
- `GEMINI_API_KEY`: Google Gemini API key for SOP analysis
- `DEBUG`: Enable debug mode (true/false)
- `PORT`: Server port (default: 5000)

## Health Monitoring

Each service provides detailed health checks:
- **Individual Service Health**: `/api/{service}/health`
- **Unified Health Check**: `/health`
- **Service Dependencies**: API connectivity status
- **Performance Metrics**: Request counts, cache statistics

## Error Handling

- Graceful degradation when AI services are unavailable
- Detailed error messages with request IDs for tracking
- Fallback to traditional methods when AI enhancement fails
- Comprehensive logging for debugging and monitoring

## Performance Features

- **Intelligent Caching**: Results caching with configurable TTL
- **Request Tracking**: Unique request IDs for monitoring
- **Parallel Processing**: Concurrent analysis in unified endpoint
- **Database Connection Pooling**: Efficient database operations