import logging
import re
from typing import Dict, List, Any
import os

logger = logging.getLogger(__name__)

class ResumeService:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY', '')
        self.azure_endpoint = os.getenv('DOCUMENTINTELLIGENCE_ENDPOINT', '')
        self.azure_key = os.getenv('DOCUMENTINTELLIGENCE_API_KEY', '')
        logger.info("Resume service initialized")
    
    def is_llm_available(self) -> bool:
        """Check if LLM service is available"""
        return bool(self.openai_api_key)
    
    def is_ocr_available(self) -> bool:
        """Check if OCR service is available"""
        return bool(self.azure_endpoint and self.azure_key)
    
    def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        """
        Analyze resume and provide ATS scoring and feedback
        
        Args:
            resume_text: The resume text to analyze
            
        Returns:
            Dictionary with ATS score and feedback
        """
        if not resume_text or not resume_text.strip():
            raise ValueError("Resume text cannot be empty")
        
        logger.info("Analyzing resume text")
        
        # Calculate component scores
        keyword_score = self._calculate_keyword_score(resume_text)
        format_score = self._calculate_format_score(resume_text)
        length_score = self._calculate_length_score(resume_text)
        actionverb_score = self._calculate_actionverb_score(resume_text)
        
        # Calculate overall ATS score (weighted average)
        ats_score = int((keyword_score * 0.3) + (format_score * 0.25) + 
                       (length_score * 0.2) + (actionverb_score * 0.25))
        
        # Generate feedback
        feedback = self._generate_feedback(resume_text, {
            'keyword_score': keyword_score,
            'format_score': format_score,
            'length_score': length_score,
            'actionverb_score': actionverb_score
        })
        
        result = {
            "ats_score": ats_score,
            "feedback": feedback,
            "scores": {
                "keyword_score": keyword_score,
                "format_score": format_score,
                "length_score": length_score,
                "actionverb_score": actionverb_score
            }
        }
        
        logger.info(f"Resume analysis completed with ATS score: {ats_score}")
        return result
    
    def _calculate_keyword_score(self, text: str) -> int:
        """Calculate keyword relevance score"""
        tech_keywords = [
            'python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'docker',
            'kubernetes', 'git', 'agile', 'scrum', 'api', 'database', 'machine learning',
            'artificial intelligence', 'data analysis', 'web development', 'mobile app',
            'cloud computing', 'devops', 'ci/cd', 'testing', 'debugging'
        ]
        
        soft_keywords = [
            'leadership', 'teamwork', 'communication', 'problem solving', 'project management',
            'collaboration', 'mentoring', 'training', 'presentation', 'strategic planning'
        ]
        
        all_keywords = tech_keywords + soft_keywords
        text_lower = text.lower()
        
        found_keywords = sum(1 for keyword in all_keywords if keyword in text_lower)
        max_possible = len(all_keywords)
        
        score = min(100, int((found_keywords / max_possible) * 100) + 20)  # Base score of 20
        return max(0, score)
    
    def _calculate_format_score(self, text: str) -> int:
        """Calculate format and structure score"""
        score = 60  # Base score
        
        # Check for email
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
            score += 10
        
        # Check for phone number
        if re.search(r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text):
            score += 10
        
        # Check for common sections
        sections = ['experience', 'education', 'skills', 'projects', 'summary', 'objective']
        found_sections = sum(1 for section in sections if section.lower() in text.lower())
        score += found_sections * 3
        
        # Check for dates (indicating work experience)
        date_patterns = [
            r'\b\d{4}\s*[-–]\s*\d{4}\b',  # 2020-2023
            r'\b\d{4}\s*[-–]\s*Present\b',  # 2020-Present
            r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b'  # Jan 2020
        ]
        
        for pattern in date_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                score += 5
                break
        
        return min(100, score)
    
    def _calculate_length_score(self, text: str) -> int:
        """Calculate length appropriateness score"""
        word_count = len(text.split())
        
        if 200 <= word_count <= 800:  # Optimal range
            return 100
        elif 100 <= word_count < 200:  # Too short
            return 70
        elif 800 < word_count <= 1200:  # Slightly long but acceptable
            return 85
        elif word_count > 1200:  # Too long
            return 60
        else:  # Very short
            return 40
    
    def _calculate_actionverb_score(self, text: str) -> int:
        """Calculate action verb usage score"""
        action_verbs = [
            'achieved', 'managed', 'led', 'developed', 'created', 'implemented',
            'designed', 'built', 'optimized', 'improved', 'increased', 'decreased',
            'collaborated', 'coordinated', 'supervised', 'mentored', 'trained',
            'analyzed', 'researched', 'solved', 'delivered', 'executed', 'launched'
        ]
        
        text_lower = text.lower()
        found_verbs = sum(1 for verb in action_verbs if verb in text_lower)
        
        # Score based on number of action verbs found
        if found_verbs >= 10:
            return 100
        elif found_verbs >= 7:
            return 85
        elif found_verbs >= 5:
            return 70
        elif found_verbs >= 3:
            return 55
        else:
            return 40
    
    def _generate_feedback(self, text: str, scores: Dict[str, int]) -> List[str]:
        """Generate actionable feedback based on analysis"""
        feedback = []
        
        # Keyword feedback
        if scores['keyword_score'] < 70:
            feedback.append("Add more relevant technical and soft skills keywords")
            feedback.append("Include industry-specific terminology and buzzwords")
        
        # Format feedback
        if scores['format_score'] < 80:
            feedback.append("Improve resume structure with clear sections (Summary, Experience, Education, Skills)")
            if '@' not in text:
                feedback.append("Add your email address")
            if not re.search(r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}', text):
                feedback.append("Add your phone number")
        
        # Length feedback
        word_count = len(text.split())
        if word_count < 200:
            feedback.append("Expand your resume with more detailed descriptions of your experience")
        elif word_count > 1000:
            feedback.append("Consider condensing your resume to focus on most relevant experiences")
        
        # Action verb feedback
        if scores['actionverb_score'] < 70:
            feedback.append("Use more strong action verbs (achieved, managed, led, developed)")
            feedback.append("Quantify your achievements with specific numbers and metrics")
        
        # General feedback
        if not any(word in text.lower() for word in ['project', 'experience', 'work']):
            feedback.append("Add more details about your projects and work experience")
        
        # Positive feedback for high scores
        if scores['keyword_score'] >= 85:
            feedback.append("Excellent use of relevant keywords!")
        if scores['actionverb_score'] >= 85:
            feedback.append("Great use of action verbs and achievement-focused language!")
        
        return feedback[:8]  # Limit to 8 feedback items
    
    def extract_text_from_pdf(self, file_content: bytes, filename: str) -> str:
        """
        Extract text from PDF using Azure Document Intelligence (if available)
        
        Args:
            file_content: PDF file content as bytes
            filename: Original filename
            
        Returns:
            Extracted text as string
        """
        if not self.is_ocr_available():
            raise Exception("OCR service not available. Configure Azure Document Intelligence credentials.")
        
        logger.info(f"Extracting text from PDF: {filename}")
        
        # TODO: Implement actual Azure Document Intelligence integration
        # For now, return a placeholder
        return "PDF text extraction would be implemented here with Azure Document Intelligence service."
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get service status information"""
        return {
            'status': 'healthy',
            'service': 'resume_analyzer',
            'llm_available': self.is_llm_available(),
            'ocr_available': self.is_ocr_available(),
            'model': 'gpt-3.5-turbo' if self.is_llm_available() else 'Not configured'
        }

# Global instance
resume_service = ResumeService()