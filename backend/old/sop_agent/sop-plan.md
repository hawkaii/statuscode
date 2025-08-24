---
# SOP Agent Enhancement Plan (sop-plan.md)

## Overview
Architecture, workflow, and enhancement roadmap for UniCompass SOP Agent: modularity, RAG, semantic search, and agentic orchestration.

## Modular Architecture
- Microservice structure: Flask API, Gemini integration, SQLAlchemy models, pgvector storage, JWT auth, config management

## RAG Workflow
- Semantic search with pgvector
- Store SOP drafts, feedback, examples as embeddings
- On review: embed user SOP, retrieve similar examples, pass context to Gemini for feedback
- Hybrid search: semantic + keyword
- Python integration: pgvector-python
- Implementation status: ✅ Completed

## Agent Workflow Orchestration
- LangGraph for durable, stateful agent orchestration
- Human-in-the-loop support
- Persistent memory for SOP history
- Integration: LangGraph for review workflows and feedback loops

## Gemini LLM Integration
- Actionable feedback via Gemini API
- Context/examples passed for tailored suggestions
- Extensible endpoints: `/review`, `/suggest`, `/examples`, `/history`

## Future Directions
- Context7 MCP for advanced agent orchestration
- RAG with external knowledge sources
- Semantic search with hybrid ranking
- Dashboard/UI enhancements

## References
- [pgvector](https://github.com/pgvector/pgvector)
- [LangGraph Python Docs](https://langchain-ai.github.io/langgraph/)
- [pgvector-python](https://github.com/pgvector/pgvector-python)
- [Context7 MCP Server](https://github.com/upstash/context7)

## Next Steps
- Integrate pgvector semantic search
- Implement LangGraph workflow orchestration
- Update documentation and dashboard (see updated README.md, AGENTS.md, GEMINI.md)
- Extend endpoints for advanced feedback/history
- Ensure embedding dimension matches model output (default: 384)
- Add troubleshooting and FAQ to docs
