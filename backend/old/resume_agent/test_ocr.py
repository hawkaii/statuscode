#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ocr_service import document_intelligence_service

def test_ocr():
    print("Testing OCR service...")
    
    # Check if service is available
    if not document_intelligence_service.is_available():
        print("❌ OCR service is not available")
        return
    
    print("✅ OCR service is available")
    
    # Try to extract text from the test document
    try:
        with open("test/document.pdf", "rb") as f:
            file_content = f.read()
        
        print(f"📄 File size: {len(file_content)} bytes")
        
        # Extract text
        extracted_text = document_intelligence_service.extract_text_from_pdf(file_content)
        
        if extracted_text:
            print(f"✅ Text extraction successful!")
            print(f"📝 Extracted {len(extracted_text)} characters")
            print(f"📋 First 200 characters: {extracted_text[:200]}...")
        else:
            print("❌ Text extraction failed")
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ocr()