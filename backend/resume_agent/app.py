from flask import Flask, request, jsonify
from flask_cors import CORS
from scoring.ats_scorer import analyze_resume
from config import config
import os

app = Flask(__name__)
CORS(app)

@app.route('/analyze_resume', methods=['POST'])
def analyze_resume_endpoint():
    try:
        # Get the JSON data from request
        data = request.get_json()
        
        # Basic validation
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        if 'resume_text' not in data:
            return jsonify({'error': 'resume_text field is required'}), 400
        
        resume_text = data['resume_text']
        
        # Analyze the resume using enhanced ATS scoring system
        result = analyze_resume(resume_text)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    # Check if LLM service is available
    try:
        from llm.llm_service import llm_service
        llm_status = llm_service.is_available()
    except:
        llm_status = False
    
    return jsonify({
        'status': 'healthy', 
        'service': 'resume_analyzer',
        'llm_available': llm_status,
        'model': config.OPENAI_MODEL if llm_status else 'Not configured'
    }), 200

@app.route('/llm_status', methods=['GET'])
def llm_status():
    """Check LLM service status"""
    try:
        from llm.llm_service import llm_service
        is_available = llm_service.is_available()
        
        return jsonify({
            'llm_available': is_available,
            'model': config.OPENAI_MODEL if is_available else None,
            'status': 'ready' if is_available else 'not_configured'
        }), 200
    except Exception as e:
        return jsonify({
            'llm_available': False,
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Enhanced Resume Analyzer on http://localhost:5001")
    print("🧠 LLM-Powered Intelligence System Ready!")
    
    # Check LLM availability on startup
    try:
        from llm.llm_service import llm_service
        if llm_service.is_available():
            print(f"✅ LLM Service Active - Model: {config.OPENAI_MODEL}")
        else:
            print("⚠️  LLM Service Not Available - Using Fallback Mode")
            print("   Add OPENAI_API_KEY to .env file to enable LLM features")
    except Exception as e:
        print(f"⚠️  LLM Service Error: {e}")
    
    app.run(debug=config.DEBUG, host='0.0.0.0', port=5001)