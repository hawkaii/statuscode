import os
import logging
from flask import Flask
from flask_cors import CORS
from config.database import init_db
from routes.health import health_bp
from routes.prediction import prediction_bp
from routes.resume import resume_bp
from routes.sop import sop_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # CORS configuration
    CORS(app, origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "https://*.vultr.com",
        "https://*.unicompass.com"
    ])
    
    # Load configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['DEBUG'] = os.getenv('DEBUG', 'false').lower() == 'true'
    
    # Database configuration
    app.config['POSTGRES_HOST'] = os.getenv('POSTGRES_HOST', 'localhost')
    app.config['POSTGRES_PORT'] = os.getenv('POSTGRES_PORT', '5432')
    app.config['POSTGRES_DB'] = os.getenv('POSTGRES_DB', 'unicompass_db')
    app.config['POSTGRES_USER'] = os.getenv('POSTGRES_USER', 'unicompass_user')
    app.config['POSTGRES_PASSWORD'] = os.getenv('POSTGRES_PASSWORD', 'password')
    
    # API Keys
    app.config['GEMINI_API_KEY'] = os.getenv('GEMINI_API_KEY', '')
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY', '')
    app.config['JWT_SECRET'] = os.getenv('JWT_SECRET', 'your-jwt-secret')
    
    # Initialize database
    try:
        init_db(app.config)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.warning(f"Database initialization failed: {e}")
        logger.info("Continuing without database features")
    
    # Register blueprints
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(prediction_bp, url_prefix='/api')
    app.register_blueprint(resume_bp, url_prefix='/api')
    app.register_blueprint(sop_bp, url_prefix='/api')
    
    # Root route
    @app.route('/')
    def index():
        return {
            "service": "UniCompass Backend API",
            "version": "1.0.0",
            "status": "running",
            "endpoints": {
                "health": "/api/health",
                "prediction": "/api/predict",
                "resume": "/api/analyze",
                "sop": "/api/review"
            }
        }
    
    logger.info("UniCompass Backend initialized successfully")
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    logger.info(f"Starting UniCompass Backend on {host}:{port}")
    app.run(host=host, port=port, debug=app.config['DEBUG'])