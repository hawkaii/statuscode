from flask import Blueprint, request, jsonify
from services.prediction_service import prediction_service
import logging

logger = logging.getLogger(__name__)

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/predict', methods=['POST'])
def predict_universities():
    """
    University prediction endpoint
    
    Expected JSON payload:
    {
        "gre": int (260-340),
        "toefl": int (0-120),
        "gpa": float (0.0-4.0)
    }
    """
    try:
        # Validate content type
        if not request.is_json:
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 400
        
        data = request.get_json()
        
        # Use prediction service
        result = prediction_service.predict_universities(data)
        
        return jsonify(result), 200
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 400
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            "error": "An internal server error occurred"
        }), 500

@prediction_bp.route('/predict/cache/info', methods=['GET'])
def get_cache_info():
    """Get prediction cache statistics"""
    try:
        cache_info = prediction_service.get_cache_info()
        return jsonify(cache_info), 200
    except Exception as e:
        logger.error(f"Cache info error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@prediction_bp.route('/predict/cache/clear', methods=['POST'])
def clear_cache():
    """Clear prediction cache (admin endpoint)"""
    try:
        result = prediction_service.clear_cache()
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Cache clear error: {str(e)}")
        return jsonify({"error": str(e)}), 500