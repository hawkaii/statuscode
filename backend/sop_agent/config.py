import os

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key')
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecret')
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///sop_agent.db')
