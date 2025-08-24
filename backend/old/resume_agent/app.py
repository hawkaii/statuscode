from flask import Flask, request, jsonify
from flask_cors import CORS
from scoring.ats_scorer import analyze_resume
from ocr_service import document_intelligence_service
from config import config
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/ocr_resume', methods=['POST'])
def ocr_resume():
    """Extract text from PDF resume using Azure Document Intelligence"""
    try:
        # Check if file is provided
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Basic file validation
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400
        
        # Check if OCR service is available
        if not document_intelligence_service.is_available():
            return jsonify({
                'error': 'OCR service not available',
                'details': 'Azure Document Intelligence service is not configured. Check DOCUMENTINTELLIGENCE_ENDPOINT and DOCUMENTINTELLIGENCE_API_KEY environment variables.'
            }), 503
        
        # Read file content
        file_content = file.read()
        
        # Extract text using Azure Document Intelligence
        extracted_text = document_intelligence_service.extract_text_from_pdf(file_content)
        
        if extracted_text is None:
            return jsonify({'error': 'Failed to extract text from PDF'}), 500
        
        # Return extracted text
        return jsonify({
            'resume_text': extracted_text,
            'filename': file.filename,
            'message': 'Text extracted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

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
    
    # Check if OCR service is available
    ocr_status = document_intelligence_service.is_available()
    
    return jsonify({
        'status': 'healthy', 
        'service': 'resume_analyzer',
        'llm_available': llm_status,
        'ocr_available': ocr_status,
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

@app.route('/ocr_status', methods=['GET'])
def ocr_status():
    """Check OCR service status"""
    try:
        is_available = document_intelligence_service.is_available()
        
        return jsonify({
            'ocr_available': is_available,
            'service': 'Azure Document Intelligence',
            'status': 'ready' if is_available else 'not_configured',
            'endpoint_configured': bool(config.DOCUMENTINTELLIGENCE_ENDPOINT),
            'key_configured': bool(config.DOCUMENTINTELLIGENCE_API_KEY)
        }), 200
    except Exception as e:
        return jsonify({
            'ocr_available': False,
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
    
    # Check OCR availability on startup
    if document_intelligence_service.is_available():
        print("✅ OCR Service Active - Azure Document Intelligence")
    else:
        print("⚠️  OCR Service Not Available")
        print("   Add DOCUMENTINTELLIGENCE_ENDPOINT and DOCUMENTINTELLIGENCE_API_KEY to .env file")
    
    app.run(debug=config.DEBUG, host='0.0.0.0', port=5001)