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
