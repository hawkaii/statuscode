from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import logging
from datetime import datetime
import uuid
from typing import Dict, List, Optional, Any
import json
import time
import sqlite3
from contextlib import contextmanager

from services.resume_service import ResumeService
from services.prediction_service import PredictionService
from services.sop_service import SOPService
from services.academic_api_service import AcademicAPIService
from models.data_models import *
from utils.config import Config
from utils.logger import setup_logging

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

config = Config()
logger = setup_logging()

resume_service = ResumeService(config)
prediction_service = PredictionService(config)
sop_service = SOPService(config)
academic_api_service = AcademicAPIService(config)

@app.route('/', methods=['GET'])
def home():
    """Main entry point - Orchestrator functionality"""
    return jsonify({
        "service": "UniCompass Unified Backend",
        "version": "1.0.0",
        "status": "active",
        "agents": {
            "resume_agent": "/api/resume/*",
            "prediction_agent": "/api/prediction/*", 
            "sop_agent": "/api/sop/*",
            "academic_api": "/api/academic/*"
        },
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Unified health check for all services"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {}
    }
    
    try:
        health_status["services"]["resume"] = resume_service.get_health()
        health_status["services"]["prediction"] = prediction_service.get_health()
        health_status["services"]["sop"] = sop_service.get_health()
        health_status["services"]["academic"] = academic_api_service.get_health()
        
        overall_healthy = all(
            service.get("status") == "healthy" 
            for service in health_status["services"].values()
        )
        
        if not overall_healthy:
            health_status["status"] = "degraded"
            
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        health_status["status"] = "unhealthy"
        health_status["error"] = str(e)
    
    return jsonify(health_status), 200 if health_status["status"] != "unhealthy" else 503

# Resume Agent Endpoints
@app.route('/api/resume/ocr_resume', methods=['POST'])
def ocr_resume():
    """PDF text extraction via Azure Document Intelligence"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are supported"}), 400
        
        result = resume_service.extract_text_from_pdf(file)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"OCR processing failed: {str(e)}")
        return jsonify({"error": "OCR processing failed", "details": str(e)}), 500

@app.route('/api/resume/analyze_resume', methods=['POST'])
def analyze_resume():
    """Comprehensive resume analysis with hybrid scoring"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Resume text is required"}), 400
        
        resume_text = data['text']
        options = data.get('options', {})
        
        result = resume_service.analyze_resume(resume_text, options)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Resume analysis failed: {str(e)}")
        return jsonify({"error": "Resume analysis failed", "details": str(e)}), 500

@app.route('/api/resume/health', methods=['GET'])
def resume_health():
    """Resume service health check"""
    return jsonify(resume_service.get_health())

@app.route('/api/resume/llm_status', methods=['GET'])
def llm_status():
    """LLM service status"""
    return jsonify(resume_service.get_llm_status())

@app.route('/api/resume/ocr_status', methods=['GET'])
def ocr_status():
    """OCR service status"""
    return jsonify(resume_service.get_ocr_status())

# Prediction Agent Endpoints
@app.route('/api/prediction/predict_universities', methods=['POST'])
def predict_universities():
    """University admission prediction"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Profile data is required"}), 400
        
        result = prediction_service.predict_universities(data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"University prediction failed: {str(e)}")
        return jsonify({"error": "University prediction failed", "details": str(e)}), 500

@app.route('/api/prediction/health', methods=['GET'])
def prediction_health():
    """Prediction service health check"""
    return jsonify(prediction_service.get_health())

# Academic API Endpoints
@app.route('/api/academic/predict', methods=['POST'])
def academic_predict():
    """Bulk university predictions (50+ universities)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Academic profile data is required"}), 400
        
        result = academic_api_service.predict_multiple(data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Academic prediction failed: {str(e)}")
        return jsonify({"error": "Academic prediction failed", "details": str(e)}), 500

@app.route('/api/academic/predict_single', methods=['POST'])
def academic_predict_single():
    """Single university prediction"""
    try:
        data = request.get_json()
        if not data or 'university' not in data:
            return jsonify({"error": "University and profile data are required"}), 400
        
        result = academic_api_service.predict_single(data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Single academic prediction failed: {str(e)}")
        return jsonify({"error": "Single academic prediction failed", "details": str(e)}), 500

@app.route('/api/academic/health', methods=['GET'])
def academic_health():
    """Academic API health check"""
    return jsonify(academic_api_service.get_health())

# SOP Agent Endpoints
@app.route('/api/sop/analyze', methods=['POST'])
def analyze_sop():
    """Analyze Statement of Purpose"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "SOP text is required"}), 400
        
        result = sop_service.analyze_sop(data['text'], data.get('options', {}))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"SOP analysis failed: {str(e)}")
        return jsonify({"error": "SOP analysis failed", "details": str(e)}), 500

@app.route('/api/sop/enhance', methods=['POST'])
def enhance_sop():
    """Enhance Statement of Purpose with AI suggestions"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "SOP text is required"}), 400
        
        result = sop_service.enhance_sop(data['text'], data.get('context', {}))
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"SOP enhancement failed: {str(e)}")
        return jsonify({"error": "SOP enhancement failed", "details": str(e)}), 500

@app.route('/api/sop/save', methods=['POST'])
def save_sop():
    """Save SOP to database"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "SOP data is required"}), 400
        
        result = sop_service.save_sop(data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"SOP save failed: {str(e)}")
        return jsonify({"error": "SOP save failed", "details": str(e)}), 500

@app.route('/api/sop/load/<sop_id>', methods=['GET'])
def load_sop(sop_id):
    """Load SOP from database"""
    try:
        result = sop_service.load_sop(sop_id)
        if result:
            return jsonify(result)
        else:
            return jsonify({"error": "SOP not found"}), 404
        
    except Exception as e:
        logger.error(f"SOP load failed: {str(e)}")
        return jsonify({"error": "SOP load failed", "details": str(e)}), 500

@app.route('/api/sop/health', methods=['GET'])
def sop_health():
    """SOP service health check"""
    return jsonify(sop_service.get_health())

# Unified Analysis Endpoint (Orchestrator functionality)
@app.route('/api/analyze', methods=['POST'])
def unified_analyze():
    """Main orchestration endpoint - coordinates between all services"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Analysis data is required"}), 400
        
        request_id = str(uuid.uuid4())
        analysis_type = data.get('type', 'full')
        
        logger.info(f"Starting unified analysis {request_id} for type: {analysis_type}")
        
        results = {
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": analysis_type,
            "results": {}
        }
        
        # Resume analysis
        if analysis_type in ['full', 'resume'] and 'resume_text' in data:
            try:
                resume_result = resume_service.analyze_resume(
                    data['resume_text'], 
                    data.get('resume_options', {})
                )
                results["results"]["resume"] = resume_result
            except Exception as e:
                logger.error(f"Resume analysis failed in unified analyze: {str(e)}")
                results["results"]["resume"] = {"error": str(e)}
        
        # University prediction
        if analysis_type in ['full', 'prediction'] and 'profile' in data:
            try:
                prediction_result = prediction_service.predict_universities(data['profile'])
                results["results"]["prediction"] = prediction_result
            except Exception as e:
                logger.error(f"Prediction analysis failed in unified analyze: {str(e)}")
                results["results"]["prediction"] = {"error": str(e)}
        
        # SOP analysis
        if analysis_type in ['full', 'sop'] and 'sop_text' in data:
            try:
                sop_result = sop_service.analyze_sop(
                    data['sop_text'], 
                    data.get('sop_options', {})
                )
                results["results"]["sop"] = sop_result
            except Exception as e:
                logger.error(f"SOP analysis failed in unified analyze: {str(e)}")
                results["results"]["sop"] = {"error": str(e)}
        
        # Academic predictions
        if analysis_type in ['full', 'academic'] and 'academic_profile' in data:
            try:
                academic_result = academic_api_service.predict_multiple(data['academic_profile'])
                results["results"]["academic"] = academic_result
            except Exception as e:
                logger.error(f"Academic analysis failed in unified analyze: {str(e)}")
                results["results"]["academic"] = {"error": str(e)}
        
        logger.info(f"Completed unified analysis {request_id}")
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Unified analysis failed: {str(e)}")
        return jsonify({"error": "Unified analysis failed", "details": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    
    logger.info(f"Starting UniCompass Unified Backend on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)