# UniCompass Backend API Documentation

## Overview
Complete API documentation for the UniCompass backend services, including all available endpoints with request/response examples.

---

## 🌐 API Base URLs

- **Orchestrator (API Gateway)**: `http://localhost:5000`
- **Prediction Agent**: `http://localhost:5002`
- **Resume Agent**: `http://localhost:5001`
- **SOP Agent**: `http://localhost:5003`

---

## 🎯 Orchestrator Endpoints (API Gateway)

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "orchestrator": "healthy",
  "prediction_agent": "healthy",
  "resume_agent": "unavailable",
  "sop_agent": "healthy",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

### University Prediction (Proxied)
```http
POST /api/predict
Content-Type: application/json

{
  "gre": 320,
  "toefl": 110,
  "gpa": 3.8
}
```

**Response:**
```json
{
  "predictions": [
    {
      "name": "University of Example",
      "chance": "Target"
    },
    {
      "name": "Sample State University", 
      "chance": "Reach"
    }
  ]
}
```

### Resume Analysis (Proxied)
```http
POST /api/analyze
Content-Type: application/json

{
  "resume_text": "John Doe\nSoftware Engineer\n\nExperience:\n- 3 years at Google\n- Python, Java, React\n\nEducation:\n- BS Computer Science, MIT"
}
```

**Response:**
```json
{
  "ats_score": 92,
  "feedback": [
    "Strong technical skills section",
    "Consider adding quantified achievements"
  ]
}
```

### SOP Review (Proxied)
```http
POST /api/review
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "user_id": "demo_user",
  "draft": "I am passionate about computer science and want to pursue my masters degree. My undergraduate experience has prepared me well for graduate studies."
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "timestamp": "2025-01-01T12:00:00Z",
  "draft": "I am passionate about computer science...",
  "feedback": [
    "Clarify your motivation for choosing this program.",
    "Add more details about your leadership experience."
  ],
  "cues": [
    "What inspired you to pursue this field?",
    "Describe a challenge you overcame."
  ],
  "context_used": 5
}
```

### SOP Suggestions (Proxied)
```http
PATCH /api/suggest
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "user_id": "demo_user",
  "revision": "I am deeply passionate about computer science and eagerly want to pursue my masters degree at your esteemed institution."
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "timestamp": "2025-01-01T12:00:00Z",
  "draft": "I am deeply passionate about...",
  "feedback": [
    "Good improvement in tone",
    "Consider adding specific examples"
  ],
  "cues": [
    "What specific research interests you?",
    "How does this program align with your goals?"
  ]
}
```

### SOP Examples (Proxied)
```http
GET /api/examples
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "title": "Leadership Example",
    "text": "During my undergraduate studies, I led a team of five in developing a mobile app for campus safety..."
  },
  {
    "title": "Research Example", 
    "text": "My passion for research was ignited when I joined the AI lab and contributed to a published paper on NLP..."
  }
]
```

### SOP History (Proxied)
```http
GET /api/history?user_id=demo_user
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "timestamp": "2025-01-01T10:00:00Z",
    "draft": "Previous SOP draft...",
    "feedback": ["Feedback 1", "Feedback 2"],
    "cues": ["Cue 1", "Cue 2"]
  }
]
```

### SOP Generation (Legacy)
```http
POST /craft_sop
Content-Type: application/json

{
  "prompt": "Write an SOP for MS in Computer Science focusing on AI and machine learning"
}
```

**Response:**
```json
{
  "sop": "This is a sample Statement of Purpose generated based on the following prompt: Write an SOP for MS in Computer Science..."
}
```

---

## 🎓 Prediction Agent Direct Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "prediction_agent",
  "timestamp": 1640995200.0,
  "cache_info": {
    "hits": 15,
    "misses": 5,
    "maxsize": 128,
    "currsize": 5
  }
}
```

### University Prediction
```http
POST /predict_universities
Content-Type: application/json

{
  "gre": 315,
  "toefl": 105,
  "gpa": 3.6
}
```

**Response:**
```json
{
  "universities": [
    "University of Illinois Urbana-Champaign",
    "Georgia Institute of Technology",
    "University of Michigan",
    "University of Texas at Austin",
    "Purdue University"
  ],
  "metadata": {
    "tier": "mid",
    "request_id": "req_1640995200123",
    "timestamp": 1640995200.0,
    "processing_time_ms": 1.23
  }
}
```

**Validation Errors:**
```json
{
  "error": "GRE score must be between 260 and 340",
  "request_id": "req_1640995200123"
}
```

### Cache Management
```http
POST /cache/clear
```

**Response:**
```json
{
  "message": "Cache cleared successfully",
  "timestamp": 1640995200.0
}
```

```http
GET /cache/info
```

**Response:**
```json
{
  "cache_info": {
    "hits": 150,
    "misses": 25,
    "maxsize": 128,
    "currsize": 25,
    "hit_rate": 0.857
  },
  "timestamp": 1640995200.0
}
```

---

## 📄 Resume Agent Direct Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "resume_analyzer",
  "llm_available": false,
  "ocr_available": false,
  "model": "Not configured"
}
```

### Resume Analysis
```http
POST /analyze_resume
Content-Type: application/json

{
  "resume_text": "Jane Smith\nEntry Level Developer\n\nEducation:\n- BS Computer Science, State University\n\nSkills:\n- Python, JavaScript, SQL"
}
```

**Response:**
```json
{
  "ats_score": 75,
  "feedback": [
    "Add more specific technical projects",
    "Include quantified achievements",
    "Consider adding certifications"
  ],
  "scores": {
    "keyword_score": 70,
    "format_score": 80,
    "length_score": 75,
    "actionverb_score": 65
  }
}
```

### OCR Resume Processing
```http
POST /api/ocr_resume
Content-Type: multipart/form-data

[FILE] resume.pdf
```

**Response:**
```json
{
  "resume_text": "Extracted text from the PDF resume...",
  "filename": "resume.pdf",
  "message": "Text extracted successfully"
}
```

**Error Response:**
```json
{
  "error": "OCR service not available",
  "details": "Azure Document Intelligence service is not configured. Check DOCUMENTINTELLIGENCE_ENDPOINT and DOCUMENTINTELLIGENCE_API_KEY environment variables."
}
```

### Service Status Checks
```http
GET /llm_status
```

**Response:**
```json
{
  "llm_available": false,
  "model": null,
  "status": "not_configured"
}
```

```http
GET /ocr_status
```

**Response:**
```json
{
  "ocr_available": false,
  "service": "Azure Document Intelligence",
  "status": "not_configured",
  "endpoint_configured": false,
  "key_configured": false
}
```

---

## 📝 SOP Agent Direct Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

### SOP Review (Database Version - main.py)
```http
POST /api/review
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "user_id": "test_user",
  "draft": "My interest in artificial intelligence stems from my undergraduate research experience where I worked on natural language processing projects."
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-01T12:00:00Z",
  "draft": "My interest in artificial intelligence...",
  "feedback": [
    "Expand on specific NLP techniques you used",
    "Connect your research to future academic goals",
    "Add more personal reflection on your discoveries"
  ],
  "cues": [
    "What specific NLP challenges did you tackle?",
    "How did this research change your perspective?",
    "Which professors or papers influenced your work?"
  ],
  "context_used": 3
}
```

### SOP Review (Memory Version - app.py)
```http
POST /review
Content-Type: application/json

{
  "user_id": "test_user",
  "draft": "I am passionate about computer science..."
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-01T12:00:00Z",
  "draft": "I am passionate about computer science...",
  "feedback": [
    "Clarify your motivation for choosing this program.",
    "Add more details about your leadership experience.",
    "Be specific about your future goals."
  ],
  "cues": [
    "What inspired you to pursue this field?",
    "Describe a challenge you overcame.",
    "How will this program help you achieve your ambitions?"
  ]
}
```

### SOP Revision Suggestions (Database Version)
```http
PATCH /api/suggest
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "user_id": "test_user",
  "revision": "My fascination with artificial intelligence was sparked during my undergraduate research in natural language processing, where I developed sentiment analysis models using transformer architectures."
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2025-01-01T12:05:00Z",
  "draft": "My fascination with artificial intelligence...",
  "feedback": [
    "Excellent technical specificity with transformers",
    "Consider adding quantitative results",
    "Link this experience to your graduate school goals"
  ],
  "cues": [
    "What accuracy improvements did your models achieve?",
    "How will you build on this experience in graduate school?",
    "Which specific transformer models did you use?"
  ]
}
```

### SOP Revision Suggestions (Memory Version)
```http
PATCH /suggest
Content-Type: application/json

{
  "user_id": "test_user",
  "revision": "My revised SOP draft..."
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2025-01-01T12:05:00Z",
  "draft": "My revised SOP draft...",
  "feedback": [
    "Good improvement in tone",
    "Consider adding specific examples"
  ],
  "cues": [
    "What specific research interests you?",
    "How does this program align with your goals?"
  ]
}
```

### SOP Examples (Database Version)
```http
GET /api/examples
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "title": "Leadership Example",
    "text": "During my undergraduate studies, I led a team of five in developing a mobile app for campus safety. This experience taught me the importance of clear communication and collaborative problem-solving, skills that will be invaluable in graduate research environments."
  },
  {
    "title": "Research Example",
    "text": "My passion for research was ignited when I joined the AI lab and contributed to a published paper on NLP sentiment analysis. Working alongside graduate students and faculty, I learned the rigorous methodology required for impactful research and discovered my specific interest in multimodal learning."
  }
]
```

### SOP Examples (Memory Version)
```http
GET /examples
```

**Response:**
```json
[
  {
    "title": "Leadership Example",
    "text": "During my undergraduate studies, I led a team of five in developing a mobile app for campus safety..."
  },
  {
    "title": "Research Example",
    "text": "My passion for research was ignited when I joined the AI lab and contributed to a published paper on NLP..."
  }
]
```

### User History (Database Version)
```http
GET /api/history?user_id=test_user
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-01-01T10:00:00Z",
    "draft": "My first SOP draft...",
    "feedback": ["Initial feedback..."],
    "cues": ["Initial cues..."]
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001", 
    "timestamp": "2025-01-01T11:00:00Z",
    "draft": "My revised SOP draft...",
    "feedback": ["Revised feedback..."],
    "cues": ["Revised cues..."]
  }
]
```

### User History (Memory Version)
```http
GET /history?user_id=test_user
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-01-01T10:00:00Z",
    "draft": "My first SOP draft...",
    "feedback": ["Initial feedback..."],
    "cues": ["Initial cues..."]
  }
]
```

---

## 🔐 Authentication

### JWT Token Format
SOP agent endpoints (database version) require JWT authentication:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtb191c2VyIn0.BEOb5QrV8VHHFkQP1VblQxSeqyTZp2Adv6zRh7EZ9ug
```

**Token Payload:**
```json
{
  "user_id": "demo_user"
}
```

**Note:** The memory version (app.py) does not require authentication.

---

## ❌ Error Responses

### Common HTTP Status Codes

**400 Bad Request:**
```json
{
  "error": "Missing required fields: gre, toefl",
  "request_id": "req_1640995200123"
}
```

**401 Unauthorized:**
```json
{
  "error": "Missing or invalid JWT token"
}
```

**404 Not Found:**
```json
{
  "error": "Endpoint not found",
  "message": "The requested endpoint does not exist"
}
```

**500 Internal Server Error:**
```json
{
  "error": "An internal server error occurred",
  "request_id": "req_1640995200123"
}
```

**503 Service Unavailable:**
```json
{
  "error": "Resume agent unavailable",
  "details": "Connection timeout",
  "fallback_data": {
    "ats_score": 75,
    "feedback": ["Service temporarily unavailable"]
  }
}
```

---

## 🧪 Testing Examples

### cURL Commands

**Test Health Check:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Test University Prediction:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"gre": 320, "toefl": 110, "gpa": 3.8}'
```

**Test Resume Analysis:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "Software Engineer with 3 years experience..."}'
```

**Test SOP Review (via Orchestrator):**
```bash
curl -X POST http://localhost:5000/api/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"user_id": "demo_user", "draft": "My statement of purpose..."}'
```

**Test SOP Review (Direct - Memory Version):**
```bash
curl -X POST http://localhost:5003/review \
  -H "Content-Type: application/json" \
  -d '{"user_id": "demo_user", "draft": "My statement of purpose..."}'
```

**Test Direct Prediction Agent:**
```bash
curl -X POST http://localhost:5002/predict_universities \
  -H "Content-Type: application/json" \
  -d '{"gre": 315, "toefl": 105, "gpa": 3.6}'
```

**Test Direct Resume Agent:**
```bash
curl -X POST http://localhost:5001/analyze_resume \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "Jane Smith\nSoftware Developer..."}'
```

**Test OCR Upload:**
```bash
curl -X POST http://localhost:5001/api/ocr_resume \
  -F "file=@resume.pdf"
```

---

## 📊 Service Versions & Features

### SOP Agent Versions
- **Memory Version (app.py)**: Simple in-memory storage, no authentication
- **Database Version (main.py)**: PostgreSQL storage, JWT authentication, RAG-enhanced feedback

### Feature Matrix
| Feature | Orchestrator | Prediction Agent | Resume Agent | SOP Agent (Memory) | SOP Agent (Database) |
|---------|--------------|------------------|--------------|-------------------|---------------------|
| Health Check | ✅ | ✅ | ✅ | ✅ | ✅ |
| Authentication | ❌ | ❌ | ❌ | ❌ | ✅ |
| Database Storage | ❌ | ❌ | ❌ | ❌ | ✅ |
| Caching | ❌ | ✅ | ❌ | ❌ | ❌ |
| File Upload | ❌ | ❌ | ✅ | ❌ | ❌ |
| External APIs | ❌ | ❌ | ✅ | ❌ | ✅ |
| RAG/Context | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 📊 Rate Limits & Performance

### Default Limits
- **Prediction Agent**: Cached responses for identical inputs
- **Resume Agent**: No specific limits (depends on external APIs)
- **SOP Agent**: Database-backed, supports concurrent users
- **Orchestrator**: Proxies requests with 30-second timeout

### Performance Metrics
- **Prediction**: ~1-2ms (cached), ~10-50ms (new)
- **Resume Analysis**: ~100-500ms (without external APIs)  
- **SOP Review**: ~200-1000ms (depending on context)
- **Health Checks**: ~5-20ms

---

This documentation covers all available endpoints across both versions of each service in the UniCompass backend system. For testing, use the provided scripts (`test-api.sh`, `test-backend.sh`) or the cURL examples above.