# AGENTS.md - Development Guidelines

## Build/Test Commands
- **Run app**: `python app.py`
- **Install deps**: `pip install -r requirements.txt`
- **Deploy**: `./deploy.sh`
- **Health check**: `curl http://localhost:5000/api/health`

## Code Style & Conventions
- **Imports**: Standard library first, then third-party, then local (with blank lines between groups)
- **Naming**: snake_case for functions/variables, PascalCase for classes, UPPER_CASE for constants
- **Type hints**: Required for all function signatures using `typing` module
- **Docstrings**: Required for all functions/classes using triple quotes
- **Error handling**: Use try/except blocks with proper logging, return JSON error responses with appropriate HTTP codes
- **Logging**: Use `logging.getLogger(__name__)` pattern, include request IDs for traceability

## Architecture Patterns
- **Flask blueprints**: Separate routes by feature (`routes/prediction.py`, `routes/resume.py`, etc.)
- **Service layer**: Business logic in `services/` directory with singleton pattern
- **Config management**: Environment variables via `os.getenv()` with defaults
- **Caching**: Use `@lru_cache` decorator for performance optimization
- **Request validation**: Validate JSON payload and return clear error messages

## Testing
- No test framework configured - add pytest for testing
- Manual testing via curl or Postman using endpoints in README.md