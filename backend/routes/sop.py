from flask import Blueprint, request, jsonify
from services.sop_service import sop_service
import logging

logger = logging.getLogger(__name__)

sop_bp = Blueprint('sop', __name__)

@sop_bp.route('/review', methods=['POST', 'OPTIONS'])
def review_sop():
    """
    SOP review endpoint
    
    Expected JSON payload:
    {
        "user_id": str,
        "draft": str
    }
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Validate content type
        if not request.is_json:
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_id = data.get('user_id')
        draft = data.get('draft')
        
        if not user_id:
            return jsonify({"error": "user_id field is required"}), 400
        
        if not draft:
            return jsonify({"error": "draft field is required"}), 400
        
        # Use SOP service
        result = sop_service.review_sop(draft, user_id)
        
        return jsonify(result), 200
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 400
        
    except Exception as e:
        logger.error(f"SOP review error: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@sop_bp.route('/suggest', methods=['PATCH', 'OPTIONS'])
def suggest_improvements():
    """
    SOP suggestion endpoint
    
    Expected JSON payload:
    {
        "user_id": str,
        "revision": str
    }
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Validate content type
        if not request.is_json:
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_id = data.get('user_id')
        revision = data.get('revision')
        
        if not user_id:
            return jsonify({"error": "user_id field is required"}), 400
        
        if not revision:
            return jsonify({"error": "revision field is required"}), 400
        
        # Use SOP service
        result = sop_service.suggest_improvements(revision, user_id)
        
        return jsonify(result), 200
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 400
        
    except Exception as e:
        logger.error(f"SOP suggestion error: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@sop_bp.route('/examples', methods=['GET', 'OPTIONS'])
def get_examples():
    """Get SOP writing examples"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        examples = sop_service.get_examples()
        return jsonify(examples), 200
    except Exception as e:
        logger.error(f"Examples error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@sop_bp.route('/history', methods=['GET', 'OPTIONS'])
def get_history():
    """
    Get user SOP history
    
    Query parameter:
    - user_id: str (required)
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id query parameter is required"}), 400
        
        history = sop_service.get_user_history(user_id)
        return jsonify(history), 200
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 400
        
    except Exception as e:
        logger.error(f"History error: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@sop_bp.route('/sop/status', methods=['GET'])
def sop_service_status():
    """Get SOP service status"""
    try:
        status = sop_service.get_service_status()
        return jsonify(status), 200
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Legacy endpoint for backward compatibility
@sop_bp.route('/craft_sop', methods=['POST'])
def craft_sop():
    """
    Legacy SOP generation endpoint (simplified mock)
    
    Expected JSON payload:
    {
        "prompt": str
    }
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        # Mock SOP generation
        sop_text = f"This is a sample Statement of Purpose generated based on the following prompt: {prompt}"
        
        return jsonify({"sop": sop_text}), 200
        
    except Exception as e:
        logger.error(f"SOP generation error: {str(e)}")
        return jsonify({"error": str(e)}), 500