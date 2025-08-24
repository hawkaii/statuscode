# API Documentation

## Resume Analyzer API Reference

Base URL: `http://localhost:5001`

---

## Endpoints

### 1. PDF Text Extraction

**POST** `/api/ocr_resume`

Extract text from PDF resumes using Azure Document Intelligence.

#### Request
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Body**: PDF file in `file` field

#### Example Request
```bash
curl -X POST \
  -F "file=@resume.pdf" \
  http://localhost:5001/api/ocr_resume
```

#### Response
```json
{
  "resume_text": "John Doe\nSoftware Engineer\nExperience:\n...",
  "filename": "resume.pdf",
  "message": "Text extracted successfully"
}
```

#### Response Fields
- `resume_text` (string): Extracted text content from PDF
- `filename` (string): Original filename
- `message` (string): Success/status message

#### Error Responses
- `400 Bad Request`: No file provided or invalid file
- `500 Internal Server Error`: OCR processing failed
- `503 Service Unavailable`: OCR service not configured

---

### 2. Resume Analysis

**POST** `/analyze_resume`

Analyze resume text and provide comprehensive ATS scoring and feedback.

#### Request
- **Method**: POST
- **Content-Type**: `application/json`
- **Body**: JSON with resume text

#### Example Request
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "John Doe Software Engineer..."}' \
  http://localhost:5001/analyze_resume
```

#### Response
```json
{
  "score": 85,
  "word_count": 450,
  "breakdown": {
    "keyword_score": 38,
    "action_verb_score": 23,
    "length_score": 15,
    "format_score": 9
  },
  "feedback": [
    "🎯 Add more quantifiable achievements to strengthen impact",
    "🔧 Include technical keywords like 'machine learning', 'cloud computing'"
  ],
  "llm_available": true,
  "llm_insights": {
    "overall_assessment": "Strong technical background with room for improvement...",
    "strengths": ["Technical expertise", "Clear education section"],
    "improvements": ["Add metrics to achievements", "Include soft skills"],
    "ats_optimization": ["Use standard section headings", "Add keyword density"]
  }
}
```

#### Response Fields
- `score` (integer): Overall ATS score (0-100)
- `word_count` (integer): Total word count of resume
- `breakdown` (object): Score breakdown by category
- `feedback` (array): Prioritized improvement suggestions
- `llm_available` (boolean): Whether LLM analysis was used
- `llm_insights` (object): Detailed AI-powered analysis (when available)

---

### 3. Complete Pipeline

Extract text from PDF and analyze in one workflow:

```bash
curl -s -X POST -F "file=@resume.pdf" http://localhost:5001/api/ocr_resume | \
curl -X POST -H "Content-Type: application/json" -d @- http://localhost:5001/analyze_resume
```

---

### 4. Health Check

**GET** `/health`

Check overall service health including LLM and OCR availability.

#### Response
```json
{
  "status": "healthy",
  "service": "resume_analyzer", 
  "llm_available": true,
  "ocr_available": true,
  "model": "openai/gpt-oss-20b"
}
```

---

### 5. LLM Status

**GET** `/llm_status`

Check LLM service configuration and availability.

#### Response
```json
{
  "llm_available": true,
  "model": "openai/gpt-oss-20b",
  "status": "ready"
}
```

---

### 6. OCR Status

**GET** `/ocr_status`

Check OCR service configuration and availability.

#### Response
```json
{
  "ocr_available": true,
  "service": "Azure Document Intelligence",
  "status": "ready",
  "endpoint_configured": true,
  "key_configured": true
}
```

---

## Error Handling

All endpoints return structured error responses:

```json
{
  "error": "Description of the error",
  "details": "Additional context (when available)"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `500`: Internal Server Error
- `503`: Service Unavailable (external service not configured)

---

## Rate Limits

- No rate limits currently implemented
- Azure Document Intelligence has service-specific limits
- LLM services may have API rate limits

---

## File Format Support

### OCR Endpoint
- **Supported**: PDF files
- **Max file size**: Depends on Azure Document Intelligence limits
- **Languages**: Multi-language support via Azure AI

### Analysis Endpoint
- **Input**: Plain text (any language)
- **Format**: JSON string in `resume_text` field

---

## Authentication

Currently no authentication required. For production deployment, consider adding:
- API keys
- JWT tokens
- Rate limiting by IP/user

---

## Examples

### Complete Workflow Example

1. **Extract text from PDF:**
```bash
curl -X POST -F "file=@john_doe_resume.pdf" http://localhost:5001/api/ocr_resume
```

2. **Analyze extracted text:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "extracted text here..."}' \
  http://localhost:5001/analyze_resume
```

3. **One-liner pipeline:**
```bash
curl -s -X POST -F "file=@john_doe_resume.pdf" http://localhost:5001/api/ocr_resume | \
curl -X POST -H "Content-Type: application/json" -d @- http://localhost:5001/analyze_resume
```

### Health Monitoring
```bash
# Check all services
curl http://localhost:5001/health

# Check specific services
curl http://localhost:5001/llm_status
curl http://localhost:5001/ocr_status
```