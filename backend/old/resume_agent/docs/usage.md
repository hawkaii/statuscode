# Usage Guide

## Resume Analyzer Usage Scenarios

This guide covers common usage patterns and scenarios for the Resume Analyzer API.

---

## Quick Start

### 1. Basic Setup
```bash
# Clone and install
git clone <repository>
cd resume_agent
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start the service
python app.py
```

### 2. Test the Service
```bash
# Check service health
curl http://localhost:5001/health

# Test OCR with sample document
curl -X POST -F "file=@test/document.pdf" http://localhost:5001/api/ocr_resume

# Test analysis
curl -X POST -H "Content-Type: application/json" \
  -d '{"resume_text": "John Doe Software Engineer..."}' \
  http://localhost:5001/analyze_resume
```

---

## Usage Scenarios

### Scenario 1: PDF Resume Analysis (Complete Pipeline)

**Use Case**: Analyze a PDF resume from upload to final score

```bash
# One-command pipeline
curl -s -X POST -F "file=@resume.pdf" http://localhost:5001/api/ocr_resume | \
curl -X POST -H "Content-Type: application/json" -d @- http://localhost:5001/analyze_resume
```

**Output**: Complete analysis with ATS score, feedback, and recommendations

### Scenario 2: Text-Only Analysis

**Use Case**: Analyze resume text without OCR (when you already have text)

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "resume_text": "John Doe\nSoftware Engineer\n5 years experience in Python, React, AWS..."
  }' \
  http://localhost:5001/analyze_resume
```

**Output**: Analysis results without OCR processing time

### Scenario 3: Batch Processing

**Use Case**: Process multiple resumes in a directory

```bash
#!/bin/bash
for pdf in *.pdf; do
  echo "Processing $pdf..."
  curl -s -X POST -F "file=@$pdf" http://localhost:5001/api/ocr_resume | \
  curl -s -X POST -H "Content-Type: application/json" -d @- http://localhost:5001/analyze_resume \
  > "analysis_$(basename "$pdf" .pdf).json"
done
```

### Scenario 4: OCR Only (Text Extraction)

**Use Case**: Extract text from PDF without analysis

```bash
curl -X POST -F "file=@resume.pdf" http://localhost:5001/api/ocr_resume | \
jq -r '.resume_text' > extracted_text.txt
```

**Output**: Plain text file with extracted resume content

### Scenario 5: Health Monitoring

**Use Case**: Monitor service availability in production

```bash
#!/bin/bash
# Health check script
if curl -s http://localhost:5001/health | jq -e '.status == "healthy"' > /dev/null; then
  echo "✅ Service is healthy"
else
  echo "❌ Service is down"
  exit 1
fi
```

---

## Integration Patterns

### Web Application Integration

```javascript
// Frontend JavaScript example
async function analyzeResume(file) {
  // Step 1: Extract text from PDF
  const formData = new FormData();
  formData.append('file', file);
  
  const ocrResponse = await fetch('/api/ocr_resume', {
    method: 'POST',
    body: formData
  });
  const ocrResult = await ocrResponse.json();
  
  // Step 2: Analyze extracted text
  const analysisResponse = await fetch('/analyze_resume', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({resume_text: ocrResult.resume_text})
  });
  
  return await analysisResponse.json();
}
```

### Python Client Integration

```python
import requests

class ResumeAnalyzer:
    def __init__(self, base_url="http://localhost:5001"):
        self.base_url = base_url
    
    def analyze_pdf(self, pdf_path):
        """Complete pipeline: PDF to analysis"""
        # Extract text
        with open(pdf_path, 'rb') as f:
            ocr_response = requests.post(
                f"{self.base_url}/api/ocr_resume",
                files={'file': f}
            )
        
        if ocr_response.status_code != 200:
            raise Exception(f"OCR failed: {ocr_response.text}")
        
        ocr_result = ocr_response.json()
        
        # Analyze text
        analysis_response = requests.post(
            f"{self.base_url}/analyze_resume",
            json={'resume_text': ocr_result['resume_text']}
        )
        
        return analysis_response.json()
    
    def analyze_text(self, resume_text):
        """Text-only analysis"""
        response = requests.post(
            f"{self.base_url}/analyze_resume",
            json={'resume_text': resume_text}
        )
        return response.json()

# Usage
analyzer = ResumeAnalyzer()
result = analyzer.analyze_pdf("resume.pdf")
print(f"ATS Score: {result['score']}")
```

---

## Response Handling

### Success Response Structure
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
    "🎯 Add quantifiable achievements",
    "🔧 Include more technical keywords"
  ],
  "llm_available": true,
  "llm_insights": {
    "overall_assessment": "Strong background...",
    "strengths": ["Technical skills", "Education"],
    "improvements": ["Add metrics", "Soft skills"]
  }
}
```

### Error Response Structure
```json
{
  "error": "Failed to extract text from PDF",
  "details": "OCR service configuration issue"
}
```

### Response Processing Examples

```python
# Python response handling
def process_analysis(response_data):
    if 'error' in response_data:
        print(f"Error: {response_data['error']}")
        return None
    
    score = response_data['score']
    feedback = response_data['feedback']
    
    print(f"ATS Score: {score}/100")
    print("Top Recommendations:")
    for item in feedback[:3]:  # Top 3 items
        print(f"  {item}")
    
    return response_data
```

```bash
# Bash response handling
analyze_resume() {
  local pdf_file="$1"
  local result=$(curl -s -X POST -F "file=@$pdf_file" http://localhost:5001/api/ocr_resume | \
                curl -s -X POST -H "Content-Type: application/json" -d @- http://localhost:5001/analyze_resume)
  
  if echo "$result" | jq -e '.error' > /dev/null; then
    echo "Error: $(echo "$result" | jq -r '.error')"
    return 1
  fi
  
  local score=$(echo "$result" | jq -r '.score')
  echo "ATS Score: $score/100"
  
  echo "$result" > "analysis_$(basename "$pdf_file" .pdf).json"
}
```

---

## Performance Optimization

### Caching Strategies

```python
# Simple in-memory caching example
import hashlib
from functools import lru_cache

class CachedAnalyzer:
    def __init__(self):
        self.text_cache = {}
    
    def analyze_text_cached(self, resume_text):
        # Create hash of text for cache key
        text_hash = hashlib.md5(resume_text.encode()).hexdigest()
        
        if text_hash in self.text_cache:
            return self.text_cache[text_hash]
        
        # Perform analysis
        result = self.analyze_text(resume_text)
        self.text_cache[text_hash] = result
        
        return result
```

### Parallel Processing

```python
import asyncio
import aiohttp

async def analyze_multiple_pdfs(pdf_files):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for pdf_file in pdf_files:
            task = analyze_pdf_async(session, pdf_file)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks)
        return results

async def analyze_pdf_async(session, pdf_file):
    # Async version of PDF analysis
    with open(pdf_file, 'rb') as f:
        data = aiohttp.FormData()
        data.add_field('file', f, filename=pdf_file)
        
        async with session.post('/api/ocr_resume', data=data) as response:
            ocr_result = await response.json()
    
    async with session.post('/analyze_resume', 
                          json={'resume_text': ocr_result['resume_text']}) as response:
        return await response.json()
```

---

## Troubleshooting

### Common Issues

#### 1. OCR Service Unavailable
```bash
# Check OCR status
curl http://localhost:5001/ocr_status

# Common causes:
# - Missing DOCUMENTINTELLIGENCE_ENDPOINT
# - Invalid DOCUMENTINTELLIGENCE_API_KEY
# - Network connectivity issues
```

#### 2. LLM Service Issues
```bash
# Check LLM status
curl http://localhost:5001/llm_status

# System still works without LLM (fallback mode)
# LLM adds enhanced insights but is not required
```

#### 3. File Upload Issues
```bash
# Ensure file is PDF and not corrupted
file resume.pdf
# Should output: "PDF document, version X.X"

# Check file size (large files may timeout)
ls -lh resume.pdf
```

### Debug Mode

```bash
# Run with debug enabled
DEBUG=true python app.py

# Check logs for detailed error information
# Logs show OCR processing steps and LLM calls
```

### Service Health Monitoring

```bash
#!/bin/bash
# Comprehensive health check
echo "🔍 Checking service health..."

# Basic health
health=$(curl -s http://localhost:5001/health)
echo "Service Status: $(echo "$health" | jq -r '.status')"

# OCR health
ocr_status=$(curl -s http://localhost:5001/ocr_status)
echo "OCR Available: $(echo "$ocr_status" | jq -r '.ocr_available')"

# LLM health
llm_status=$(curl -s http://localhost:5001/llm_status)
echo "LLM Available: $(echo "$llm_status" | jq -r '.llm_available')"

# Test with sample file
if [ -f "test/document.pdf" ]; then
  echo "🧪 Testing with sample document..."
  test_result=$(curl -s -X POST -F "file=@test/document.pdf" http://localhost:5001/api/ocr_resume)
  if echo "$test_result" | jq -e '.resume_text' > /dev/null; then
    echo "✅ Sample test passed"
  else
    echo "❌ Sample test failed"
    echo "$test_result"
  fi
fi
```

---

## Best Practices

### 1. Error Handling
- Always check for `error` field in responses
- Implement retry logic for transient failures
- Log errors for debugging

### 2. Performance
- Cache analysis results when possible
- Use text-only analysis when PDF processing isn't needed
- Process multiple files in parallel for batch operations

### 3. Security
- Validate file uploads before processing
- Sanitize user input
- Use HTTPS in production
- Implement rate limiting

### 4. Monitoring
- Monitor service health regularly
- Track response times and error rates
- Set up alerts for service failures