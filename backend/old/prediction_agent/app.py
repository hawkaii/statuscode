
import logging
import os
from typing import Dict, List, Any, Tuple
from functools import lru_cache
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('prediction_agent.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
class Config:
    PORT = int(os.getenv('PORT', 5002))
    HOST = os.getenv('HOST', '0.0.0.0')
    DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    CACHE_SIZE = int(os.getenv('CACHE_SIZE', 128))

# Predefined lists of universities by tier
TOP_TIER = [
    "Massachusetts Institute of Technology (MIT)",
    "Stanford University", 
    "Carnegie Mellon University",
    "University of California, Berkeley"
]

MID_TIER = [
    "University of Illinois Urbana-Champaign",
    "Georgia Institute of Technology",
    "University of Michigan",
    "University of Texas at Austin",
    "Purdue University"
]

LOWER_TIER = [
    "Arizona State University",
    "University of Florida",
    "Texas A&M University",
    "Ohio State University"
]

def validate_input_data(data: Dict) -> Tuple[bool, str]:
    """
    Validates input data for university prediction.
    
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    if not data:
        return False, "Request body must be valid JSON"
    
    required_fields = ['gre', 'toefl', 'gpa']
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    try:
        gre_score = int(data['gre'])
        toefl_score = int(data['toefl']) 
        gpa_score = float(data['gpa'])
        
        # Validate score ranges
        if not (260 <= gre_score <= 340):
            return False, "GRE score must be between 260 and 340"
        if not (0 <= toefl_score <= 120):
            return False, "TOEFL score must be between 0 and 120"
        if not (0.0 <= gpa_score <= 4.0):
            return False, "GPA must be between 0.0 and 4.0"
            
        return True, ""
        
    except (ValueError, TypeError) as e:
        return False, f"Invalid data types for scores: {str(e)}"

@lru_cache(maxsize=Config.CACHE_SIZE)
def predict_university_tier(gre: int, toefl: int, gpa: float) -> Tuple[List[str], str]:
    """
    Predicts university tier based on academic scores.
    Uses LRU cache for performance optimization.
    
    Args:
        gre: GRE score (260-340)
        toefl: TOEFL score (0-120)
        gpa: GPA (0.0-4.0)
        
    Returns:
        Tuple of (universities list, tier name)
    """
    if gre >= 320 and gpa >= 3.7 and toefl >= 105:
        return TOP_TIER, "top"
    elif gre >= 310 and gpa >= 3.5 and toefl >= 95:
        return MID_TIER, "mid"
    else:
        return LOWER_TIER, "lower"

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        "status": "healthy",
        "service": "prediction_agent",
        "timestamp": time.time(),
        "cache_info": {
            "hits": predict_university_tier.cache_info().hits,
            "misses": predict_university_tier.cache_info().misses,
            "maxsize": predict_university_tier.cache_info().maxsize,
            "currsize": predict_university_tier.cache_info().currsize
        }
    }), 200

@app.route('/predict_universities', methods=['POST'])
def predict_universities():
    """
    Predicts universities based on academic scores.
    
    Expected JSON payload:
    {
        "gre": int (260-340),
        "toefl": int (0-120), 
        "gpa": float (0.0-4.0)
    }
    
    Returns:
    {
        "universities": List[str],
        "metadata": {
            "tier": str,
            "request_id": str,
            "timestamp": float
        }
    }
    """
    request_start_time = time.time()
    request_id = f"req_{int(request_start_time * 1000)}"
    
    logger.info(f"[{request_id}] Received university prediction request")
    
    try:
        # Validate content type
        if not request.is_json:
            logger.warning(f"[{request_id}] Invalid content type")
            return jsonify({
                "error": "Content-Type must be application/json",
                "request_id": request_id
            }), 400
        
        data = request.get_json()
        
        # Validate input data
        is_valid, error_message = validate_input_data(data)
        if not is_valid:
            logger.warning(f"[{request_id}] Validation error: {error_message}")
            return jsonify({
                "error": error_message,
                "request_id": request_id
            }), 400
        
        # Extract and convert scores
        gre_score = int(data['gre'])
        toefl_score = int(data['toefl'])
        gpa_score = float(data['gpa'])
        
        # Predict universities (cached for performance)
        universities, tier = predict_university_tier(gre_score, toefl_score, gpa_score)
        
        processing_time = (time.time() - request_start_time) * 1000
        
        response = {
            "universities": universities,
            "metadata": {
                "tier": tier,
                "request_id": request_id,
                "timestamp": time.time(),
                "processing_time_ms": round(processing_time, 2)
            }
        }
        
        logger.info(f"[{request_id}] Successfully predicted {len(universities)} universities in {tier} tier ({processing_time:.2f}ms)")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            "error": "An internal server error occurred",
            "request_id": request_id
        }), 500

@app.route('/cache/clear', methods=['POST'])
def clear_cache():
    """Clear the prediction cache (admin endpoint)."""
    predict_university_tier.cache_clear()
    logger.info("Prediction cache cleared")
    return jsonify({
        "message": "Cache cleared successfully",
        "timestamp": time.time()
    }), 200

@app.route('/cache/info', methods=['GET'])
def cache_info():
    """Get cache statistics."""
    cache_stats = predict_university_tier.cache_info()
    return jsonify({
        "cache_info": {
            "hits": cache_stats.hits,
            "misses": cache_stats.misses,
            "maxsize": cache_stats.maxsize,
            "currsize": cache_stats.currsize,
            "hit_rate": cache_stats.hits / (cache_stats.hits + cache_stats.misses) if (cache_stats.hits + cache_stats.misses) > 0 else 0
        },
        "timestamp": time.time()
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        "error": "Endpoint not found",
        "message": "The requested endpoint does not exist"
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({
        "error": "Method not allowed",
        "message": "The requested method is not allowed for this endpoint"
    }), 405

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred"
    }), 500

if __name__ == '__main__':
    logger.info(f"Starting Prediction Agent server on {Config.HOST}:{Config.PORT}")
    logger.info(f"Debug mode: {Config.DEBUG}")
    logger.info(f"Cache size: {Config.CACHE_SIZE}")
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
