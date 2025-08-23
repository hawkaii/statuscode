# Gemini API Integration Guide

This project uses the Gemini API for generating actionable feedback on SOP drafts. The agent passes context (similar examples, cues, and feedback) to Gemini for tailored suggestions.

## Setup
- Obtain your Gemini API key from Google
- Set `GEMINI_API_KEY` in your `.env` file

## Usage in Backend
- The backend uses `gemini-1.5-flash` as the model name (see `gemini_client.py`)
- API key is loaded from environment variables
- Context is passed to Gemini for RAG-enhanced feedback

## Example Usage
```python
from gemini_client import GeminiClient
client = GeminiClient(api_key="your-gemini-api-key")
feedback = client.review_sop_with_context(draft, context)
```

## Troubleshooting
- Ensure your API key is valid and active
- Use the correct model name: `gemini-1.5-flash`
- Check network/firewall settings if requests fail

## References
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
