from groq import Groq
from config import config
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        """Initialize OpenAI client"""
        try:
            config.validate_config()
            self.client = Groq(api_key=config.OPENAI_API_KEY)
            self.model = config.OPENAI_MODEL
            logger.info(f"LLM Service initialized with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize LLM service: {e}")
            self.client = None
    
    def is_available(self):
        """Check if LLM service is available"""
        return self.client is not None
    
    def generate_completion(self, prompt, max_tokens=None, temperature=None):
        """Generate completion using OpenAI API"""
        if not self.is_available():
            raise Exception("LLM service not available. Check OpenAI API key.")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_completion_tokens=max_tokens or config.MAX_TOKENS,
                temperature=temperature or config.TEMPERATURE
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            logger.error(f"LLM completion failed: {e}")
            raise Exception(f"LLM request failed: {str(e)}")
    
    def parse_json_response(self, response_text):
        """Parse JSON response from LLM, with error handling"""
        try:
            # Clean up response (remove markdown formatting if present)
            cleaned_response = response_text.strip()
            if cleaned_response.startswith('```json'):
                cleaned_response = cleaned_response[7:]
            if cleaned_response.endswith('```'):
                cleaned_response = cleaned_response[:-3]
            cleaned_response = cleaned_response.strip()
            
            return json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Response text: {response_text}")
            raise Exception(f"Invalid JSON response from LLM: {str(e)}")

# Global LLM service instance
llm_service = LLMService()
