# 🚀 Resume Analyzer (LLM-Powered, Dockerized)

A modern, agentic Python API for resume analysis, powered by LLMs and designed for robust ATS scoring. Easily deployable with Docker, extensible for agentic workflows, and ready for integration with OpenAI or Groq.

---

## 🧰 Tech Stack

- **Python 3.11+**
- **Flask** (API server)
- **Docker & Docker Compose** (containerization)
- **LLM Integration** (OpenAI, Groq)
- **CORS** (for cross-origin requests)
- **Pydantic** (validation)
- **python-dotenv** (environment config)

---

## ⚡ Features

- **/analyze_resume**: POST endpoint for resume text analysis (ATS scoring, LLM-powered)
- **/health**: Service and LLM health check
- **/llm_status**: LLM model/config status endpoint
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
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o
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

### GET `/health`

Returns service and LLM status.

### GET `/llm_status`

Returns LLM model and availability.

---

## 🛠️ Development

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

- Store secrets in `.env`
- Required: `OPENAI_API_KEY`, `OPENAI_MODEL`
- Optional: `DEBUG`, other LLM provider keys

---

## 🤖 LLM Agentic Architecture

- Modular LLM integration (OpenAI, Groq, etc.)
- Extendable for agentic workflows and prompt engineering
- See `llm/llm_service.py` for model logic

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

**Ready to analyze resumes with LLM intelligence and agentic workflows!**
