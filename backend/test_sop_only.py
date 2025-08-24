#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime

# Simple mock services to avoid dependencies
class MockConfig:
    def __init__(self):
        self.DATABASE_URL = "sqlite:///test.db"
        self.GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', None)

class MockResumeService:
    def get_health(self): return {"status": "healthy"}

class MockPredictionService:
    def get_health(self): return {"status": "healthy"}

class MockAcademicAPIService:
    def get_health(self): return {"status": "healthy"}

# Import the real SOP service
from services.sop_service import SOPService

app = Flask(__name__)
CORS(app)

config = MockConfig()
sop_service = SOPService(config)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "service": "SOP Service Test",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.utcnow().isoformat()
    })

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
        return jsonify({"error": "SOP analysis failed", "details": str(e)}), 500

@app.route('/api/sop/enhance', methods=['POST'])
def enhance_sop():
    """Enhance Statement of Purpose"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "SOP text is required"}), 400
        
        result = sop_service.enhance_sop(data['text'], data.get('context', {}))
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": "SOP enhancement failed", "details": str(e)}), 500

@app.route('/api/sop/health', methods=['GET'])
def sop_health():
    """SOP service health check"""
    return jsonify(sop_service.get_health())

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting SOP test server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)