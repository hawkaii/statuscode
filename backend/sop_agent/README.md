# UniCompass SOP Agent

A Retrieval-Augmented Generation (RAG) agent for reviewing Statement of Purpose (SOP) drafts, powered by Gemini AI and semantic search with pgvector.

## Features
- **RAG-Enhanced Feedback:** Finds similar SOPs and feedback for context-aware review
- **Vector Similarity Search:** Uses pgvector for fast, accurate semantic matching
- **Contextual Guidance:** Leverages examples and history for tailored feedback
- **Modular Architecture:** Clean separation of API, storage, embeddings, and AI
- **JWT Authentication:** Secure endpoints for user data
- **Dockerized Deployment:** Easy setup for development and production

## Quick Start

### Option 1: Docker (Recommended)
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

### Option 2: Local Development
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

## Architecture
- **main.py:** Flask API endpoints with RAG integration
- **gemini_client.py:** Gemini AI integration
- **storage.py:** Data persistence and semantic search
- **models.py:** SQLAlchemy models for SOP history and embeddings
- **auth.py:** JWT authentication
- **config.py:** Configuration management

### RAG Workflow
1. **Embedding Generation:** Convert SOP drafts to vector embeddings
2. **Semantic Search:** Find similar examples and feedback using pgvector
3. **Context Building:** Combine similar content for enhanced prompts
4. **AI Generation:** Use Gemini with context for more relevant feedback
5. **Storage:** Save embeddings for future searches

## Configuration
- `GEMINI_API_KEY`: Your Gemini API key
- `SECRET_KEY`: JWT secret key
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@localhost/sop_agent`)

## Docker Commands
```bash
# Start services
docker-compose up -d
# View logs
docker-compose logs -f
# Stop services
docker-compose down
# Rebuild and restart
docker-compose up -d --build
# Access the app container
docker-compose exec app bash
# Initialize embeddings
docker-compose exec app python init_embeddings.py
# View database
docker-compose exec postgres psql -U sop_user -d sop_agent
```

## Development
- **Testing:** Use `pytest` (see `tests/`)
- **Frontend:** Next.js app in `frontend/` (see `frontend-plan.md`)
- **Enhancement Plan:** See `sop-plan.md` for architecture and roadmap
- **Gemini API:** See `GEMINI.md` for integration details

## Troubleshooting
- **pgvector not found:** Ensure pgvector is installed and enabled
- **Embedding errors:** Check embedding function returns correct dimensions
- **Database connection:** Verify `DATABASE_URL` and credentials

## License
MIT License - see LICENSE file for details.
