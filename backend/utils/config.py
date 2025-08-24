import os
from dotenv import load_dotenv
import logging

load_dotenv()

class Config:
    """Central configuration management"""
    
    def __init__(self):
        # General settings
        self.DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
        self.SECRET_KEY = os.getenv('SECRET_KEY', 'supersecret')
        self.PORT = int(os.getenv('PORT', 5000))
        
        # Groq API (used for LLM functionality)
        self.GROQ_API_KEY = os.getenv('OPENAI_API_KEY', os.getenv('GROQ_API_KEY', ''))
        self.GROQ_MODEL = os.getenv('OPENAI_MODEL', 'llama3-8b-8192')
        self.MAX_TOKENS = int(os.getenv('MAX_TOKENS', 2000))
        self.TEMPERATURE = float(os.getenv('TEMPERATURE', 0.3))
        
        # Azure Document Intelligence
        self.AZURE_DOC_INTELLIGENCE_KEY = os.getenv('DOCUMENTINTELLIGENCE_API_KEY', '')
        self.AZURE_DOC_INTELLIGENCE_ENDPOINT = os.getenv(
            'DOCUMENTINTELLIGENCE_ENDPOINT', 
            'https://hawkaii-resume.cognitiveservices.azure.com/'
        ).strip('"\'')  # Remove any surrounding quotes
        
        # Gemini API (for SOP agent)
        self.GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
        
        # Database
        self.DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///unicompass.db')
        
        # Cache settings
        self.CACHE_SIZE = int(os.getenv('CACHE_SIZE', 128))
        self.CACHE_TTL = int(os.getenv('CACHE_TTL', 3600))  # 1 hour
        
        # File upload settings
        self.MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 16 * 1024 * 1024))  # 16MB
        self.UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
        
        # Scoring weights
        self.SCORING_WEIGHTS = {
            'keywords': 40,
            'action_verbs': 25,
            'length': 20,
            'format': 15
        }
        
        # University tiers configuration
        self.UNIVERSITY_TIERS = {
            'top': 0.8,      # 80% probability threshold for top tier
            'middle': 0.6,   # 60% probability threshold for middle tier
            'safety': 0.4    # 40% probability threshold for safety
        }
        
        # Logging level
        self.LOG_LEVEL = getattr(logging, os.getenv('LOG_LEVEL', 'INFO').upper())
        
    def validate_config(self):
        """Validate required configuration values"""
        errors = []
        
        if not self.GROQ_API_KEY:
            errors.append("GROQ_API_KEY (or OPENAI_API_KEY) is required")
        
        if not self.AZURE_DOC_INTELLIGENCE_KEY:
            errors.append("DOCUMENTINTELLIGENCE_API_KEY is required for OCR functionality")
        
        if not self.GEMINI_API_KEY:
            errors.append("GEMINI_API_KEY is required for SOP functionality")
        
        if errors:
            raise ValueError(f"Configuration validation failed: {', '.join(errors)}")
        
        return True
    
    def get_groq_config(self):
        """Get Groq API configuration"""
        return {
            'api_key': self.GROQ_API_KEY,
            'model': self.GROQ_MODEL,
            'max_tokens': self.MAX_TOKENS,
            'temperature': self.TEMPERATURE
        }
    
    def get_azure_config(self):
        """Get Azure Document Intelligence configuration"""
        return {
            'key': self.AZURE_DOC_INTELLIGENCE_KEY,
            'endpoint': self.AZURE_DOC_INTELLIGENCE_ENDPOINT
        }
    
    def get_gemini_config(self):
        """Get Gemini API configuration"""
        return {
            'api_key': self.GEMINI_API_KEY
        }