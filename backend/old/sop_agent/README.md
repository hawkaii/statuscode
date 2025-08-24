# UniCompass SOP Agent

A Retrieval-Augmented Generation (RAG) agent for reviewing Statement of Purpose (SOP) drafts, powered by Gemini AI and semantic search with pgvector.

---

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
  - [Docker (Recommended)](#docker-recommended)
  - [Local Development](#local-development)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Embedding & RAG Workflow](#embedding--rag-workflow)
- [Testing & Development](#testing--development)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Contributing](#contributing)
- [References](#references)
- [License](#license)

---

## Overview

UniCompass SOP Agent is a backend service for reviewing and improving Statement of Purpose drafts. It leverages semantic search (pgvector) and Google Gemini AI to provide context-aware, actionable feedback. The agent uses Retrieval-Augmented Generation (RAG) to find similar SOPs and feedback, enhancing the quality and relevance of its suggestions.

---

## Architecture
- **main.py:** Flask API endpoints with RAG integration
- **gemini_client.py:** Gemini AI integration
- **storage.py:** Data persistence and semantic search
- **models.py:** SQLAlchemy models for SOP history and embeddings
- **auth.py:** JWT authentication
- **config.py:** Configuration management
- **init_embeddings.py:** Initializes and populates the vector database
- **frontend/**: Next.js frontend (see `frontend-plan.md`)

---

## Setup & Installation

### Docker (Recommended)
1. **Prerequisites:**
   - Docker & Docker Compose
   - Gemini API key

2. **Setup:**
   ```bash
   # Clone or navigate to the project
   cd sop_agent

   # Set your Gemini API key
   echo "GEMINI_API_KEY=your-actual-gemini-api-key" > .env

   # Start the application
   docker-compose up -d

   # Initialize embeddings (after containers are up)
   docker-compose exec app python init_embeddings.py
   ```

3. **Access:**
   - API: http://localhost:5003
   - PostgreSQL: localhost:5432

### Local Development
1. **Install pgvector:**
   ```bash
   # Install pgvector extension for PostgreSQL
   git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git
   cd pgvector
   make
   make install
   ```
2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```
4. **Database setup:**
   ```sql
   CREATE DATABASE sop_agent;
   \c sop_agent;
   CREATE EXTENSION vector;
   ```
5. **Initialize and run:**
   ```bash
   python -c "from models import init_db; init_db()"
   python init_embeddings.py
   python main.py
   ```

---

## Configuration
- `GEMINI_API_KEY`: Your Gemini API key
- `SECRET_KEY`: JWT secret key
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@localhost/sop_agent`)

See `.env.example` for all required variables.

---

## API Endpoints

### POST /review
Review an SOP draft with RAG-enhanced feedback.
**Request:**
```json
{
  "user_id": "user123",
  "draft": "Your SOP draft text here..."
}
```
**Response:**
```json
{
  "id": "uuid",
  "timestamp": "2024-01-01T00:00:00",
  "draft": "Your SOP draft text here...",
  "feedback": ["Feedback item 1", "Feedback item 2"],
  "cues": ["Cue item 1", "Cue item 2"],
  "context_used": 3
}
```

### GET /examples
Get static SOP examples.

### GET /history
Get user's SOP review history.

### PATCH /suggest
Get feedback on revised SOP drafts.

---

## Embedding & RAG Workflow

1. **Sentence Encoding:**
   - SOP drafts and queries are converted to dense vector embeddings using transformer models (e.g., `all-MiniLM-L6-v2`).
   - Embeddings are stored in PostgreSQL with pgvector for fast semantic search.

2. **Retrieval Augmented Generation (RAG):**
   - When reviewing, the agent encodes the query and finds similar SOPs via vector search.
   - Retrieved documents are passed to Gemini AI for context-aware feedback.
   - The response is returned to the frontend/user.

---

## Testing & Development
- **Backend:**
  - Install dependencies: `pip install -r requirements.txt`
  - Run all tests: `pytest tests`
  - Run a single test: `pytest tests/test_api.py`
- **Frontend:**
  - See `frontend-plan.md` for Next.js setup and commands
- **Enhancement Plan:**
  - See `sop-plan.md` for architecture and roadmap
- **Gemini API:**
  - See `GEMINI.md` for integration details

---

## Troubleshooting & FAQ
- **pgvector not found:** Ensure pgvector is installed and enabled in PostgreSQL.
- **Embedding errors:** Check that the embedding function returns the correct dimensions (default: 384).
- **Database connection:** Verify `DATABASE_URL` and credentials.
- **Gemini API issues:** Ensure your API key is valid and the model name is correct (`gemini-1.5-flash`).
- **Docker issues:** Use `docker-compose logs -f` to view logs and debug.
- **CORS errors:** Ensure backend is running and accessible from the frontend.

---

## Contributing
- Follow PEP8 for Python code and ESLint/Prettier for frontend.
- Group imports: stdlib, third-party, local.
- Use docstrings and descriptive names.
- Submit PRs with clear descriptions and reference related issues.
- See `AGENTS.md` for build, lint, and test commands.

---

## References
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [pgvector](https://github.com/pgvector/pgvector)
- [sentence-transformers](https://www.sbert.net/)
- [Flask](https://flask.palletsprojects.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)

---

## License
MIT License - see LICENSE file for details.
