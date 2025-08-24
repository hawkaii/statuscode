# UniCompass Architecture (A2A & ADK Edition)

## Overview

UniCompass is evolving to a modern, agentic microservices architecture leveraging the A2A (Agent-to-Agent) protocol and ADK (Agent Development Kit) for secure, interoperable, and extensible agent communication. This enables seamless integration of Python and Go agents, scalable service orchestration, and robust authentication.

---

## Core Concepts

### 1. A2A Protocol
- **Purpose:** Standardizes communication between agents/services using JSON-RPC 2.0 over HTTP(S).
- **Features:**
  - Secure messaging (JWT, API keys)
  - Streaming (SSE) and async push notifications (webhooks)
  - Agent discovery via AgentCard (`/.well-known/agent.json`)
  - Extensible via protocol extensions

### 2. ADK (Agent Development Kit)
- **Purpose:** Go library for building A2A-compatible agents and servers.
- **Features:**
  - Fluent builder patterns for agent/server configuration
  - LLM integration (OpenAI, Anthropic, Ollama, etc.)
  - Custom tool and business logic support
  - Push notification and streaming support
  - Secure authentication and error handling

---

## Architecture Diagram

```
+------------------+      (User Interaction)
|   Browser / UI   |
+------------------+
        |
        v
+------------------+      (Main Server)
| OrchestratorAgent|
|  (A2A/ADK Agent) |
+------------------+
        |
        |---- A2A Protocol ----> +-------------------+
        |                       |  PredictionAgent  |
        |                       +-------------------+
        |
        |---- A2A Protocol ----> +-------------------+
        |                       |    ResumeAgent    |
        |                       +-------------------+
        |
        |---- MCP Protocol -----> +-------------------+
                                |    Gemini API     |
                                +-------------------+
```

---

## Persistent Agent Results & Database Schema

To enable users to revisit previous agent results (resume analysis, SOP drafts, conversations), UniCompass uses a persistent database (e.g., PostgreSQL).

**Schema:**
- `users`: id, email, name, created_at
- `agent_results`: id, user_id, agent_type, result_type, result_data (JSONB), created_at
- `conversations`: id, user_id, agent_id, messages (JSONB), created_at
- `sop_drafts`: id, user_id, draft_text, status, created_at, updated_at
- `important_dates`: id, user_id, university_name, program_name, date_type, date, notes, reminder_sent, created_at

**Data Flow:**
- When an agent produces a result, it saves it to `agent_results` (or `sop_drafts`/`conversations` as appropriate), keyed by user.
- When a user adds a university/program to their profile, the system fetches and stores relevant deadlines and important dates in `important_dates`.
- The dashboard UI queries these tables to show users their history and upcoming deadlines.
- Reminders/notifications are sent for approaching dates (tracked via `reminder_sent`).
- All endpoints require JWT authentication; users only access their own data.

**API Endpoints:**
- `POST /api/results` (save new agent result)
- `GET /api/results?user_id=...` (list previous results)
- `GET /api/conversations?user_id=...` (list previous conversations)
- `POST /api/sop_drafts` (save new SOP draft)
- `GET /api/sop_drafts?user_id=...` (list previous SOP drafts)
- `POST /api/important_dates` (add a new important date)
- `GET /api/important_dates?user_id=...` (list all dates for a user)
- `GET /api/important_dates/upcoming?user_id=...` (list only upcoming dates)
- `DELETE /api/important_dates/:id` (remove a date)
- `POST /api/important_dates/remind` (trigger/send reminders)

**Security:**
- All endpoints require JWT Bearer authentication (via authly).
- Data access is restricted to the authenticated user.

---

## How We Leverage A2A & ADK

### Agent Interoperability
- All agents (Go, Python, etc.) expose A2A endpoints and AgentCards for discovery.
- Communication is standardized, secure, and language-agnostic.

### Secure Messaging & Auth
- JWT or API key authentication for all agent-to-agent and user-to-agent requests.
- Push notifications (webhooks) for async updates (e.g., task completion).

### Streaming & Async Workflows
- Real-time updates via `message/stream` (SSE).
- Async task state changes via push notifications.

### Extensibility
- Agents declare custom extensions in their AgentCard for protocol negotiation.
- New agents/services can be added at any time—just expose an A2A endpoint.

### Tooling & Custom Logic
- ADK enables Go agents to:
  - Integrate LLMs and external APIs
  - Add custom tools (e.g., weather, resume parsing)
  - Manage task state, history, and artifacts

### Health, Discovery, Monitoring
- Health endpoints and AgentCard metadata for service discovery and monitoring.
- OpenTelemetry integration for metrics and tracing.

---

## What to Be Aware Of

- **Security:**
  - Always validate JWTs and manage keys securely.
  - Protect push notifications against replay attacks.
- **Versioning:**
  - Extensions and protocol features are versioned; agents must negotiate compatible versions.
- **Error Handling:**
  - Use structured error responses (JSON-RPC spec) and comprehensive logging.
- **Environment Variables:**
  - Configure agents via env vars for keys, URLs, model settings, etc.
- **Testing:**
  - Use table-driven tests and mocks for endpoints and agent logic.
- **Deployment:**
  - Containerize agents/services, use Kubernetes for orchestration, automate build/test/lint workflows.

---

## Example AgentCard (JSON)

```json
{
  "name": "ResumeAgent",
  "description": "Analyzes resumes and provides ATS feedback.",
  "url": "http://resume-agent:5001/a2a",
  "version": "1.0.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "securitySchemes": {
    "jwt": {
      "type": "http",
      "scheme": "bearer"
    }
  },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["application/json"],
  "skills": [
    {
      "id": "analyze-resume",
      "name": "Resume Analysis",
      "description": "Provides ATS score and actionable feedback.",
      "tags": ["resume", "ats", "feedback"]
    }
  ]
}
```

---

## Next Steps

1. Decide which services/agents to expose as A2A endpoints.
2. Implement A2A endpoints using ADK (Go) or Python SDK.
3. Define AgentCards for each service.
4. Integrate JWT authentication and push notification configs.
5. Test interoperability and error handling.
6. Document agents/services for onboarding and discovery.
7. Implement persistent storage for agent results, user history, and important dates.
8. Update dashboard UI to show previous results and upcoming deadlines.

---

*This architecture enables UniCompass to scale, interoperate, and securely orchestrate agentic services for a robust AI-powered student application platform with persistent user history, results, and personalized deadline tracking.*
