import logging
import os
from typing import Optional
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import AzureError
from config import config

logger = logging.getLogger(__name__)

class DocumentIntelligenceService:
    def __init__(self):
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the Document Analysis client"""
        try:
            config.validate_document_intelligence_config()
            self.client = DocumentAnalysisClient(
                endpoint=config.DOCUMENTINTELLIGENCE_ENDPOINT,
                credential=AzureKeyCredential(config.DOCUMENTINTELLIGENCE_API_KEY)
            )
            logger.info("Document Analysis client initialized successfully")
        except Exception as e:
            logger.warning(f"Document Analysis client initialization failed: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """Check if Document Analysis service is available"""
        return self.client is not None
    
    def extract_text_from_pdf(self, file_content: bytes) -> Optional[str]:
        """
        Extract text from PDF using Azure Form Recognizer
        
        Args:
            file_content: PDF file content as bytes
            
        Returns:
            Extracted text as string or None if extraction fails
        """
        if not self.is_available():
            logger.error("Document Analysis service is not available")
            return None
        
        try:
            # Analyze document using prebuilt-read model for text extraction
            poller = self.client.begin_analyze_document("prebuilt-read", file_content)
            result = poller.result()
            
            # Extract text content
            if result.content:
                logger.info(f"Successfully extracted text from PDF ({len(result.content)} characters)")
                return result.content
            else:
                logger.warning("No text content extracted from PDF")
                return None
                
        except AzureError as e:
            logger.error(f"Azure Document Analysis error: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during text extraction: {e}")
            return None
    
    def extract_text_with_layout(self, file_content: bytes) -> Optional[dict]:
        """
        Extract text with detailed layout information from PDF
        
        Args:
            file_content: PDF file content as bytes
            
        Returns:
            Dictionary containing extracted text and layout information
        """
        if not self.is_available():
            logger.error("Document Analysis service is not available")
            return None
        
        try:
            # Analyze document using prebuilt-layout model
            poller = self.client.begin_analyze_document("prebuilt-layout", file_content)
            result = poller.result()
            
            # Extract comprehensive information
            extracted_data = {
                'text': result.content or '',
                'pages': len(result.pages) if result.pages else 0,
                'paragraphs': len(result.paragraphs) if result.paragraphs else 0,
                'lines': sum(len(page.lines) for page in result.pages) if result.pages else 0,
                'words': sum(len(page.words) for page in result.pages) if result.pages else 0
            }
            
            logger.info(f"Successfully extracted text with layout: {extracted_data['pages']} pages, {len(extracted_data['text'])} characters")
            return extracted_data
                
        except AzureError as e:
            logger.error(f"Azure Document Analysis error: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during text extraction: {e}")
            return None

# Create service instance
document_intelligence_service = DocumentIntelligenceService()