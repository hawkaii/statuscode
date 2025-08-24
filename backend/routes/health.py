from flask import Blueprint, jsonify
from services.prediction_service import prediction_service
from services.resume_service import resume_service
from services.sop_service import sop_service
import logging

logger = logging.getLogger(__name__)

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Unified health check endpoint for all services
    """
    try:
        # Check all services
        prediction_status = "healthy"
        resume_status = "healthy" 
        sop_status = "healthy"
        
        # Get detailed service info
        prediction_cache_info = prediction_service.get_cache_info()
        resume_service_info = resume_service.get_service_status()
        sop_service_info = sop_service.get_service_status()
        
        health_data = {
            "status": "healthy",
            "service": "unicompass_backend",
            "timestamp": prediction_cache_info["timestamp"],
            "services": {
                "prediction": {
                    "status": prediction_status,
                    "cache_info": prediction_cache_info["cache_info"]
                },
                "resume": {
                    "status": resume_status,
                    "llm_available": resume_service_info["llm_available"],
                    "ocr_available": resume_service_info["ocr_available"]
                },
                "sop": {
                    "status": sop_status,
                    "gemini_available": sop_service_info["gemini_available"],
                    "total_users": sop_service_info["total_users"]
                }
            }
        }
        
        return jsonify(health_data), 200
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "service": "unicompass_backend",
            "error": str(e)
        }), 500