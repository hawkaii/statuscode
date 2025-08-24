# 🚀 Resume Analyzer (LLM-Powered, Dockerized, OCR-Enabled)

A modern, agentic Python API for resume analysis, powered by LLMs and Azure Document Intelligence OCR. Designed for robust ATS scoring, PDF text extraction, and easy integration with OpenAI/Groq.

---

## 🧰 Tech Stack

- **Python 3.11+**
- **Flask** (API server)
- **Azure Document Intelligence** (OCR/PDF text extraction)
- **Docker & Docker Compose** (containerization)
- **LLM Integration** (OpenAI, Groq)
- **CORS** (for cross-origin requests)
- **Pydantic** (validation)
- **python-dotenv** (environment config)

---

## ⚡ Features

- **/api/ocr_resume**: POST endpoint for PDF text extraction using Azure Document Intelligence
- **/analyze_resume**: POST endpoint for resume text analysis (ATS scoring, LLM-powered)
- **/health**: Service, LLM, and OCR health check
- **/llm_status**: LLM model/config status endpoint
- **/ocr_status**: OCR service status endpoint
- **Complete Pipeline**: PDF → OCR → Analysis in one workflow
- **Agentic architecture**: Ready for advanced LLM workflows
- **Dockerized**: One-command deployment
- **Configurable**: .env-driven secrets and model selection

---

## 🚀 Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/your-org/resume-analyze.git
cd resume-analyze
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# LLM Configuration
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o

# Azure Document Intelligence Configuration
DOCUMENTINTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
DOCUMENTINTELLIGENCE_API_KEY=your_azure_key

# Application Configuration
DEBUG=True
```

### 3. Run Locally

```bash
python app.py
```

### 4. Run with Docker

```bash
docker-compose up --build
```

App runs at: [http://localhost:5001](http://localhost:5001)

---

## 📝 API Reference

### POST `/api/ocr_resume`

Extract text from PDF resume using Azure Document Intelligence.

**Request:**
```bash
curl -X POST -F "file=@resume.pdf" http://localhost:5001/api/ocr_resume
```

**Response:**
```json
{
  "resume_text": "John Doe\nSoftware Engineer\n...",
  "filename": "resume.pdf",
  "message": "Text extracted successfully"
}
```

### POST `/analyze_resume`

Analyze resume text for ATS/LLM scoring.

**Request:**
```json
{
  "resume_text": "Your resume text here"
}
```

**Response:**
```json
{
  "score": 87,
  "feedback": "Great use of keywords. Add more quantifiable achievements."
}
```

### Complete Pipeline Example

Extract text from PDF and analyze in one workflow:

```bash
# Extract text from PDF
curl -s -X POST -F "file=@resume.pdf" http://localhost:5001/api/ocr_resume | \
# Pipe to analysis endpoint
curl -X POST -H "Content-Type: application/json" -d @- http://localhost:5001/analyze_resume
```

### GET `/health`

Returns service, LLM, and OCR status.

**Response:**
```json
{
  "status": "healthy",
  "service": "resume_analyzer",
  "llm_available": true,
  "ocr_available": true,
  "model": "gpt-4o"
}
```

### GET `/ocr_status`

Returns OCR service status and configuration.

---

## 🛠️ Development

- **Install dependencies:** `pip install -r requirements.txt`
- **Run:** `python app.py`
- **Test OCR:** `curl -X POST -F "file=@test.pdf" http://localhost:5001/api/ocr_resume`
- **Test Analysis:** `curl -X POST -H "Content-Type: application/json" -d '{"resume_text": "test"}' http://localhost:5001/analyze_resume`
- **Health Checks:** `curl http://localhost:5001/health && curl http://localhost:5001/ocr_status`
- **Lint:** `python -m flake8 .`
- **Format:** `python -m black .`
- **Tests:** Add tests in `tests/` and run with `python -m unittest discover tests`
- **Code Style:** See [AGENTS.md](./AGENTS.md) for guidelines

---

## 🐳 Docker & Deployment

- **Dockerfile**: Lightweight, production-ready
- **docker-compose.yml**: Healthchecks, env config, auto-restart

**Build & Run:**
```bash
docker-compose up --build
```

---

## 🔒 Configuration

Store secrets in `.env`:

### Required Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key for LLM functionality
- `OPENAI_MODEL`: LLM model to use (e.g., 'gpt-4o')
- `DOCUMENTINTELLIGENCE_ENDPOINT`: Azure Document Intelligence endpoint
- `DOCUMENTINTELLIGENCE_API_KEY`: Azure Document Intelligence API key

### Optional Environment Variables
- `DEBUG`: Enable debug mode (default: False)
- `MAX_TOKENS`: Maximum tokens for LLM responses (default: 1500)
- `TEMPERATURE`: LLM temperature setting (default: 0.3)

---

## 🤖 LLM & OCR Architecture

- **Modular LLM integration**: OpenAI, Groq, etc.
- **Azure Document Intelligence**: Enterprise-grade PDF text extraction
- **Graceful degradation**: Works with/without LLM or OCR services
- **Extendable**: Ready for agentic workflows and prompt engineering
- See `llm/llm_service.py` for LLM logic and `ocr_service.py` for OCR integration

---

## 🤝 Contributing

- Fork, branch, and PR welcome!
- Follow code style in [AGENTS.md](./AGENTS.md)
- Add tests for new features

---

## 📄 License

MIT License

---

## 📚 Further Documentation

- [docs/api.md](./docs/api.md): Endpoint details & examples
- [docs/architecture.md](./docs/architecture.md): System & agentic design
- [docs/usage.md](./docs/usage.md): Usage scenarios
- [docs/llm.md](./docs/llm.md): LLM integration & config
- [docs/docker.md](./docs/docker.md): Docker deployment
- [docs/contributing.md](./docs/contributing.md): Contribution guide

---

**Ready to analyze resumes with LLM intelligence, OCR extraction, and agentic workflows!**
