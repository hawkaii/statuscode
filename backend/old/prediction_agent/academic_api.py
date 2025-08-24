import logging
import os
import pickle
import pandas as pd
from typing import Dict, Any
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('academic_api.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class Config:
    PORT = int(os.getenv('PORT', 5003))
    HOST = os.getenv('HOST', '0.0.0.0')
    DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

# Load data and model
try:
    df = pd.read_csv("output.csv")
    min_univ_count = 25
    univ_counts = df["univName"].value_counts()
    keep_univs = univ_counts[univ_counts >= min_univ_count].index
    
    with open("academic_model.pkl", "rb") as f:
        model = pickle.load(f)
    
    logger.info(f"Successfully loaded model and data. Available universities: {len(keep_univs)}")
except Exception as e:
    logger.error(f"Failed to load model or data: {e}")
    model = None
    keep_univs = []

def validate_input_data(data: Dict) -> tuple[bool, str]:
    """Validate input data for academic prediction."""
    if not data:
        return False, "Request body must be valid JSON"
    
    required_fields = [
        'researchExp', 'industryExp', 'toeflScore', 'gmatA', 'cgpa', 
        'gmatQ', 'cgpaScale', 'gmatV', 'gre_total', 'researchPubs'
    ]
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    try:
        # Validate numeric fields
        numeric_fields = {
            'researchExp': (0, 50),
            'industryExp': (0, 50), 
            'toeflScore': (0, 120),
            'gmatA': (0, 6),
            'cgpa': (0, 10),
            'gmatQ': (0, 60),
            'cgpaScale': (4, 10),
            'gmatV': (0, 60),
            'gre_total': (260, 340),
            'researchPubs': (0, 100)
        }
        
        for field, (min_val, max_val) in numeric_fields.items():
            if field in data:
                value = float(data[field])
                if not (min_val <= value <= max_val):
                    return False, f"{field} must be between {min_val} and {max_val}"
                    
        return True, ""
        
    except (ValueError, TypeError) as e:
        return False, f"Invalid data types for numeric fields: {str(e)}"

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "academic_prediction_agent",
        "model_loaded": model is not None,
        "universities_available": len(keep_univs),
        "timestamp": time.time()
    }), 200

@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict admission probabilities for all universities based on applicant profile.
    
    Returns top universities ranked by admission probability.
    """
    request_start_time = time.time()
    request_id = f"req_{int(request_start_time * 1000)}"
    
    logger.info(f"[{request_id}] Received academic prediction request")
    
    try:
        if model is None:
            logger.error(f"[{request_id}] Model not loaded")
            return jsonify({
                "error": "Model not loaded",
                "request_id": request_id
            }), 500
        
        if not request.is_json:
            logger.warning(f"[{request_id}] Invalid content type")
            return jsonify({
                "error": "Content-Type must be application/json",
                "request_id": request_id
            }), 400
        
        applicant = request.get_json()
        
        # Validate input
        is_valid, error_message = validate_input_data(applicant)
        if not is_valid:
            logger.warning(f"[{request_id}] Validation error: {error_message}")
            return jsonify({
                "error": error_message,
                "request_id": request_id
            }), 400
        
        # Create predictions for all universities
        univs = sorted(keep_univs)
        X_cand = pd.DataFrame([applicant] * len(univs))
        X_cand["univName"] = univs

        # Get calibrated probability of admit=1 for each university
        probs = model.predict_proba(X_cand)[:, 1]

        results = pd.DataFrame({"univName": univs, "p_admit": probs})
        # Show top 50 universities by predicted admit probability
        top_results = results.sort_values("p_admit", ascending=False).head(50).reset_index(drop=True)
        
        processing_time = (time.time() - request_start_time) * 1000
        
        response = {
            "predictions": top_results.to_dict('records'),
            "metadata": {
                "total_universities": len(univs),
                "top_results_count": len(top_results),
                "request_id": request_id,
                "timestamp": time.time(),
                "processing_time_ms": round(processing_time, 2)
            }
        }
        
        logger.info(f"[{request_id}] Successfully predicted for {len(univs)} universities ({processing_time:.2f}ms)")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            "error": "An internal server error occurred",
            "request_id": request_id
        }), 500

@app.route('/predict_single', methods=['POST'])
def predict_single():
    """
    Predict admission probability for a specific university.
    
    Expected JSON payload includes 'univName' field.
    """
    request_start_time = time.time()
    request_id = f"req_{int(request_start_time * 1000)}"
    
    logger.info(f"[{request_id}] Received single university prediction request")
    
    try:
        if model is None:
            return jsonify({"error": "Model not loaded", "request_id": request_id}), 500
        
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json", "request_id": request_id}), 400
        
        data = request.get_json()
        
        # Validate input
        is_valid, error_message = validate_input_data(data)
        if not is_valid:
            return jsonify({"error": error_message, "request_id": request_id}), 400
        
        if 'univName' not in data:
            return jsonify({"error": "univName is required", "request_id": request_id}), 400
        
        if data['univName'] not in keep_univs:
            return jsonify({
                "error": f"University '{data['univName']}' not found in training data",
                "available_universities": sorted(keep_univs)[:10],  # Show first 10 as example
                "request_id": request_id
            }), 400
        
        # Create DataFrame for single prediction
        input_data = pd.DataFrame([data])
        
        # Make prediction
        probability_admit = float(model.predict_proba(input_data)[0][1])
        prediction = bool(model.predict(input_data)[0])
        
        processing_time = (time.time() - request_start_time) * 1000
        
        response = {
            "prediction": {
                "admit_probability": round(probability_admit, 4),
                "admit_prediction": prediction,
                "university": data['univName']
            },
            "metadata": {
                "request_id": request_id,
                "timestamp": time.time(),
                "processing_time_ms": round(processing_time, 2)
            }
        }
        
        logger.info(f"[{request_id}] Successfully predicted {probability_admit:.4f} for {data['univName']} ({processing_time:.2f}ms)")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error: {str(e)}", exc_info=True)
        return jsonify({"error": "An internal server error occurred", "request_id": request_id}), 500

@app.route('/universities', methods=['GET'])
def get_universities():
    """Get list of available universities."""
    return jsonify({
        "universities": sorted(keep_univs),
        "count": len(keep_univs),
        "timestamp": time.time()
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "message": "The requested endpoint does not exist"
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "error": "Method not allowed",
        "message": "The requested method is not allowed for this endpoint"
    }), 405

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        "error": "Internal server error",
        "message": "An unexpected error occurred"
    }), 500

if __name__ == "__main__":
    logger.info(f"Starting Academic Prediction Agent server on {Config.HOST}:{Config.PORT}")
    logger.info(f"Debug mode: {Config.DEBUG}")
    logger.info(f"Model loaded: {model is not None}")
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
