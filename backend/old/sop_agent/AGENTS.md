# AGENTS.md

## Build, Lint, and Test Commands
- **Frontend (Next.js/TypeScript):**
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Start: `npm run start`
  - Lint: `npm run lint`
- **Backend (Python/Flask):**
  - Install deps: `pip install -r requirements.txt`
  - Test all: `pytest tests`
  - Test single file: `pytest tests/test_api.py`

## Agent Workflows
- **Review Agent:**
  - Accepts SOP draft, retrieves similar examples via semantic search, passes context to Gemini AI, returns actionable feedback and cues.
- **Suggest Agent:**
  - Accepts revised SOP, compares with previous drafts, retrieves relevant feedback, and suggests improvements.
- **History Agent:**
  - Returns user’s SOP review history, including drafts, feedback, and context used.

## Example Usage
- See `main.py` for API endpoints and agent orchestration.
- See `gemini_client.py` for Gemini integration and prompt construction.

## Contribution Guidelines
- Follow code style rules below for all agent logic and API endpoints.

## Code Style Guidelines
- **Frontend:**
  - Use ESLint (Next.js core-web-vitals, TypeScript)
  - Prefer named imports, path aliases (`@/*` → `src/*`)
  - Use camelCase for variables/functions, PascalCase for components
  - Strict TypeScript (`strict: true`)
  - Format with Prettier defaults (2 spaces, semicolons, single quotes)
  - Handle errors with try/catch and error boundaries
- **Backend:**
  - Follow PEP8 (4 spaces, snake_case)
  - Group imports: stdlib, third-party, local
  - Use try/except for error handling
  - Docstrings for functions/classes
  - Descriptive variable and function names

## General
- Ignore build, node_modules, .next, out, and test artifacts
- No Cursor or Copilot rules present
- Keep code modular, readable, and well-documented
