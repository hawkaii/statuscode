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

## Advanced Usage & Prompt Engineering
- You can pass multiple context documents (examples, cues, history) to Gemini for richer feedback.
- Prompts are constructed to include retrieved SOPs and feedback, improving relevance and reducing hallucinations.
- For best results, keep context concise and focused on the user’s goals.

## Troubleshooting
- Ensure your API key is valid and active
- Use the correct model name: `gemini-1.5-flash`
- Check network/firewall settings if requests fail
- If feedback is generic, verify that relevant context is being retrieved and passed to Gemini

## References
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Prompt Engineering Guide](https://ai.google.dev/gemini-api/docs/prompt-engineering)

## Troubleshooting
- Ensure your API key is valid and active
- Use the correct model name: `gemini-1.5-flash`
- Check network/firewall settings if requests fail

## References
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
