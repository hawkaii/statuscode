from flask import Blueprint, request, jsonify
from services.resume_service import resume_service
import logging

logger = logging.getLogger(__name__)

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    """
    Resume analysis endpoint
    
    Expected JSON payload:
    {
        "resume_text": str
    }
    """
    try:
        # Validate content type
        if not request.is_json:
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        if 'resume_text' not in data:
            return jsonify({"error": "resume_text field is required"}), 400
        
        resume_text = data['resume_text']
        
        # Use resume service
        result = resume_service.analyze_resume(resume_text)
        
        return jsonify(result), 200
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 400
        
    except Exception as e:
        logger.error(f"Resume analysis error: {str(e)}")
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@resume_bp.route('/resume/ocr', methods=['POST'])
def ocr_resume():
    """
    OCR resume processing endpoint for PDF files
    
    Expected: multipart/form-data with 'file' field
    """
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
        if not resume_service.is_ocr_available():
            return jsonify({
                'error': 'OCR service not available',
                'details': 'Azure Document Intelligence service is not configured. Check DOCUMENTINTELLIGENCE_ENDPOINT and DOCUMENTINTELLIGENCE_API_KEY environment variables.'
            }), 503
        
        # Read file content
        file_content = file.read()
        
        # Extract text using OCR service
        extracted_text = resume_service.extract_text_from_pdf(file_content, file.filename)
        
        if extracted_text is None:
            return jsonify({'error': 'Failed to extract text from PDF'}), 500
        
        # Return extracted text
        return jsonify({
            'resume_text': extracted_text,
            'filename': file.filename,
            'message': 'Text extracted successfully'
        }), 200
        
    except Exception as e:
        logger.error(f"OCR error: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

@resume_bp.route('/resume/status', methods=['GET'])
def resume_service_status():
    """Get resume service status"""
    try:
        status = resume_service.get_service_status()
        return jsonify(status), 200
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        return jsonify({"error": str(e)}), 500