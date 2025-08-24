import os
import google.generativeai as genai

class GeminiClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def review_sop(self, draft):
        prompt = (
            "Review this SOP draft. Give actionable feedback, specific cues, and suggest improvements. "
            "Do not rewrite the essay, only annotate and guide."
        )
        response = self.model.generate_content(f"{prompt}\n\nSOP Draft:\n{draft}")
        return self._parse_response(response.text)

    def review_sop_with_context(self, draft, context):
        """Review SOP with RAG context from similar examples and feedback"""

        # Build context string
        context_str = ""
        if context.get("similar_examples"):
            context_str += "\nSimilar SOP Examples:\n" + "\n".join(
                f"- {example}" for example in context["similar_examples"]
            )

        if context.get("similar_feedback"):
            context_str += "\n\nSimilar Feedback Patterns:\n" + "\n".join(
                f"- {feedback}" for feedback in context["similar_feedback"]
            )

        prompt = (
            "Review this SOP draft using the provided context from similar examples and feedback patterns. "
            "Give actionable feedback, specific cues, and suggest improvements. "
            "Do not rewrite the essay, only annotate and guide. "
            "Use the context to provide more relevant and specific guidance."
        )

        full_prompt = f"{prompt}\n\nContext:{context_str}\n\nSOP Draft:\n{draft}"

        response = self.model.generate_content(full_prompt)
        return self._parse_response(response.text)

    def _parse_response(self, response_text):
        """Parse Gemini response into feedback and cues"""
        feedback, cues = [], []
        for line in response_text.split('\n'):
            if line.lower().startswith('feedback:'):
                feedback.append(line[len('feedback:'):].strip())
            elif line.lower().startswith('cue:'):
                cues.append(line[len('cue:'):].strip())
            elif line:
                # Heuristic: alternate lines
                if len(feedback) <= len(cues):
                    feedback.append(line.strip())
                else:
                    cues.append(line.strip())
        return {"feedback": feedback, "cues": cues}
