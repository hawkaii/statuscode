import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'openai/gpt-oss-20b')
    
    # Azure Document Intelligence Configuration
    DOCUMENTINTELLIGENCE_ENDPOINT = os.getenv('DOCUMENTINTELLIGENCE_ENDPOINT')
    DOCUMENTINTELLIGENCE_API_KEY = os.getenv('DOCUMENTINTELLIGENCE_API_KEY')
    
    # Application Configuration
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # LLM Settings
    MAX_TOKENS = int(os.getenv('MAX_TOKENS', '1500'))
    TEMPERATURE = float(os.getenv('TEMPERATURE', '0.3'))
    
    @classmethod
    def validate_config(cls):
        """Validate that required configuration is present"""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        return True
    
    @classmethod
    def validate_document_intelligence_config(cls):
        """Validate that Document Intelligence configuration is present"""
        if not cls.DOCUMENTINTELLIGENCE_ENDPOINT:
            raise ValueError("DOCUMENTINTELLIGENCE_ENDPOINT environment variable is required")
        if not cls.DOCUMENTINTELLIGENCE_API_KEY:
            raise ValueError("DOCUMENTINTELLIGENCE_API_KEY environment variable is required")
        return True

# Create default config instance
config = Config()
