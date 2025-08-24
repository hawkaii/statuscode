from typing import Dict, List, Optional, Any
import logging
import time
import uuid
from datetime import datetime
import re
import requests
from groq import Groq
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from werkzeug.datastructures import FileStorage
import tempfile
import os

from models.data_models import *
from utils.config import Config

logger = logging.getLogger('unicompass.resume_service')

class ResumeService:
    """Comprehensive resume analysis service combining OCR, scoring, and AI enhancement"""
    
    def __init__(self, config: Config):
        self.config = config
        self.groq_client = None
        self.azure_client = None
        
        # Initialize Groq client
        try:
            if config.GROQ_API_KEY:
                self.groq_client = Groq(api_key=config.GROQ_API_KEY)
                logger.info("Groq client initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize Groq client: {str(e)}")
        
        # Initialize Azure Document Intelligence client
        try:
            if config.AZURE_DOC_INTELLIGENCE_KEY and config.AZURE_DOC_INTELLIGENCE_ENDPOINT:
                credential = AzureKeyCredential(config.AZURE_DOC_INTELLIGENCE_KEY)
                self.azure_client = DocumentAnalysisClient(
                    endpoint=config.AZURE_DOC_INTELLIGENCE_ENDPOINT,
                    credential=credential
                )
                logger.info("Azure Document Intelligence client initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize Azure client: {str(e)}")
    
    def extract_text_from_pdf(self, file: FileStorage) -> Dict[str, Any]:
        """Extract text from PDF using Azure Document Intelligence"""
        start_time = time.time()
        
        if not self.azure_client:
            raise Exception("Azure Document Intelligence client not initialized")
        
        try:
            # Save uploaded file to temporary location
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                file.save(tmp_file.name)
                
                # Analyze document
                with open(tmp_file.name, 'rb') as f:
                    poller = self.azure_client.begin_analyze_document(
                        "prebuilt-document", document=f
                    )
                    result = poller.result()
                
                # Clean up temporary file
                os.unlink(tmp_file.name)
            
            # Extract text content
            extracted_text = ""
            for page in result.pages:
                for line in page.lines:
                    extracted_text += line.content + "\n"
            
            processing_time = time.time() - start_time
            
            return {
                "success": True,
                "text": extracted_text,
                "processing_time": processing_time,
                "pages": len(result.pages),
                "confidence": self._calculate_ocr_quality(result)
            }
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {str(e)}")
            raise Exception(f"OCR extraction failed: {str(e)}")
    
    def analyze_resume(self, resume_text: str, options: Dict[str, Any] = {}) -> Dict[str, Any]:
        """Comprehensive resume analysis with hybrid scoring"""
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        logger.info(f"Starting resume analysis {request_id}")
        
        try:
            # Parse resume with LLM if available
            parsed_resume = self._parse_resume_with_llm(resume_text)
            if not parsed_resume:
                parsed_resume = self._parse_resume_traditional(resume_text)
            
            # Calculate ATS score
            ats_score = self._calculate_ats_score(resume_text, parsed_resume)
            
            # Generate AI insights if available
            ai_insights = None
            if self.groq_client:
                try:
                    ai_insights = self._generate_ai_insights(resume_text, parsed_resume)
                except Exception as e:
                    logger.warning(f"AI insights generation failed: {str(e)}")
            
            # Generate feedback
            feedback = self._generate_feedback(parsed_resume, ats_score, ai_insights)
            
            processing_time = time.time() - start_time
            
            result = ResumeAnalysisResult(
                request_id=request_id,
                timestamp=datetime.utcnow().isoformat(),
                parsed_resume=parsed_resume,
                ats_score=ats_score,
                ai_insights=ai_insights,
                feedback=feedback,
                processing_time=processing_time
            )
            
            logger.info(f"Completed resume analysis {request_id} in {processing_time:.2f}s")
            return result.dict()
            
        except Exception as e:
            logger.error(f"Resume analysis failed: {str(e)}")
            raise Exception(f"Resume analysis failed: {str(e)}")
    
    def _parse_resume_with_llm(self, resume_text: str) -> Optional[ParsedResume]:
        """Parse resume using LLM for structured data extraction"""
        if not self.groq_client:
            return None
        
        try:
            prompt = f"""
            Parse the following resume and extract structured information in JSON format.
            Include: contact_info, summary, work_experience, education, skills, certifications, projects, languages.
            
            Resume:
            {resume_text}
            
            Return only valid JSON.
            """
            
            response = self.groq_client.chat.completions.create(
                model=self.config.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=self.config.MAX_TOKENS,
                temperature=self.config.TEMPERATURE
            )
            
            # Parse response and create ParsedResume object
            import json
            parsed_data = json.loads(response.choices[0].message.content)
            
            # Convert to ParsedResume model
            return self._convert_to_parsed_resume(parsed_data, resume_text)
            
        except Exception as e:
            logger.error(f"LLM parsing failed: {str(e)}")
            return None
    
    def _parse_resume_traditional(self, resume_text: str) -> ParsedResume:
        """Traditional parsing using regex and keyword matching"""
        # Extract contact info
        contact_info = self._extract_contact_info(resume_text)
        
        # Extract sections
        work_experience = self._extract_work_experience(resume_text)
        education = self._extract_education(resume_text)
        skills = self._extract_skills(resume_text)
        
        return ParsedResume(
            contact_info=contact_info,
            work_experience=work_experience,
            education=education,
            skills=skills,
            raw_text=resume_text
        )
    
    def _calculate_ats_score(self, resume_text: str, parsed_resume: ParsedResume) -> ATSScore:
        """Calculate comprehensive ATS score using hybrid approach"""
        
        # Keyword scoring (40 points)
        keyword_score = self._score_keywords(resume_text, parsed_resume)
        
        # Action verb scoring (25 points)
        action_verb_score = self._score_action_verbs(resume_text)
        
        # Length scoring (20 points)
        length_score = self._score_length(resume_text)
        
        # Format scoring (15 points)
        format_score = self._score_format(resume_text, parsed_resume)
        
        total_score = keyword_score + action_verb_score + length_score + format_score
        
        return ATSScore(
            total_score=min(total_score, 100),
            keyword_score=keyword_score,
            action_verb_score=action_verb_score,
            length_score=length_score,
            format_score=format_score,
            breakdown={
                "keywords": {"score": keyword_score, "max": 40},
                "action_verbs": {"score": action_verb_score, "max": 25},
                "length": {"score": length_score, "max": 20},
                "format": {"score": format_score, "max": 15}
            }
        )
    
    def _generate_ai_insights(self, resume_text: str, parsed_resume: ParsedResume) -> Dict[str, Any]:
        """Generate AI-powered insights about the resume"""
        try:
            prompt = f"""
            Analyze this resume and provide insights about:
            1. Overall strength assessment
            2. Industry alignment 
            3. Career progression analysis
            4. Unique value proposition
            5. Competitive advantages
            6. Areas for improvement
            
            Resume: {resume_text[:2000]}...
            
            Provide insights in JSON format.
            """
            
            response = self.groq_client.chat.completions.create(
                model=self.config.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000,
                temperature=0.3
            )
            
            import json
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"AI insights generation failed: {str(e)}")
            return {"error": str(e)}
    
    def _generate_feedback(self, parsed_resume: ParsedResume, ats_score: ATSScore, ai_insights: Optional[Dict]) -> List[Feedback]:
        """Generate actionable feedback based on analysis"""
        feedback = []
        
        # Score-based feedback
        if ats_score.keyword_score < 25:
            feedback.append(Feedback(
                priority="high",
                category="keywords",
                message="Your resume lacks industry-relevant keywords",
                suggestion="Include more technical terms and skills relevant to your target role",
                impact="Could significantly improve ATS ranking"
            ))
        
        if ats_score.action_verb_score < 15:
            feedback.append(Feedback(
                priority="medium",
                category="language",
                message="Limited use of strong action verbs",
                suggestion="Start bullet points with impactful action verbs like 'developed', 'optimized', 'led'",
                impact="Makes achievements more compelling"
            ))
        
        if ats_score.format_score < 10:
            feedback.append(Feedback(
                priority="high",
                category="format",
                message="Resume format needs improvement",
                suggestion="Use consistent formatting, proper sections, and clear structure",
                impact="Essential for ATS parsing and readability"
            ))
        
        # AI-based feedback
        if ai_insights and "areas_for_improvement" in ai_insights:
            for improvement in ai_insights.get("areas_for_improvement", [])[:3]:
                feedback.append(Feedback(
                    priority="medium",
                    category="content",
                    message=f"AI suggests: {improvement}",
                    suggestion="Review and implement this AI recommendation",
                    impact="Based on advanced analysis of your resume content"
                ))
        
        return feedback
    
    # Helper methods for scoring
    def _score_keywords(self, resume_text: str, parsed_resume: ParsedResume) -> float:
        """Score based on relevant keywords (40 points max)"""
        technical_keywords = [
            'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'aws', 'docker',
            'kubernetes', 'machine learning', 'data science', 'api', 'database', 'git'
        ]
        
        soft_keywords = [
            'leadership', 'teamwork', 'communication', 'project management', 'problem solving',
            'analytical', 'strategic', 'innovative', 'collaborative'
        ]
        
        text_lower = resume_text.lower()
        found_technical = sum(1 for keyword in technical_keywords if keyword in text_lower)
        found_soft = sum(1 for keyword in soft_keywords if keyword in text_lower)
        
        # Score: technical keywords worth more
        score = (found_technical * 2.5) + (found_soft * 1.5)
        return min(score, 40)
    
    def _score_action_verbs(self, resume_text: str) -> float:
        """Score based on strong action verbs (25 points max)"""
        action_verbs = [
            'achieved', 'developed', 'implemented', 'optimized', 'led', 'managed', 'created',
            'improved', 'increased', 'reduced', 'built', 'designed', 'analyzed', 'coordinated'
        ]
        
        text_lower = resume_text.lower()
        found_verbs = sum(1 for verb in action_verbs if verb in text_lower)
        
        score = found_verbs * 2
        return min(score, 25)
    
    def _score_length(self, resume_text: str) -> float:
        """Score based on optimal word count (20 points max)"""
        word_count = len(resume_text.split())
        
        # Optimal range: 300-800 words
        if 300 <= word_count <= 800:
            return 20
        elif 200 <= word_count < 300 or 800 < word_count <= 1000:
            return 15
        elif 100 <= word_count < 200 or 1000 < word_count <= 1200:
            return 10
        else:
            return 5
    
    def _score_format(self, resume_text: str, parsed_resume: ParsedResume) -> float:
        """Score based on format and structure (15 points max)"""
        score = 0
        
        # Check for contact info
        if parsed_resume.contact_info.email:
            score += 3
        if parsed_resume.contact_info.phone:
            score += 2
        
        # Check for sections
        if parsed_resume.work_experience:
            score += 4
        if parsed_resume.education:
            score += 3
        if parsed_resume.skills:
            score += 3
        
        return min(score, 15)
    
    # Helper methods for parsing
    def _extract_contact_info(self, resume_text: str) -> ContactInfo:
        """Extract contact information using regex"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'[\+]?[1-9]?[0-9]{7,15}'
        
        email_match = re.search(email_pattern, resume_text)
        phone_match = re.search(phone_pattern, resume_text)
        
        return ContactInfo(
            email=email_match.group() if email_match else None,
            phone=phone_match.group() if phone_match else None
        )
    
    def _extract_work_experience(self, resume_text: str) -> List[WorkExperience]:
        """Extract work experience (simplified implementation)"""
        # This is a simplified version - would need more sophisticated parsing
        return []
    
    def _extract_education(self, resume_text: str) -> List[Education]:
        """Extract education information (simplified implementation)"""
        return []
    
    def _extract_skills(self, resume_text: str) -> List[Skill]:
        """Extract skills (simplified implementation)"""
        return []
    
    def _convert_to_parsed_resume(self, parsed_data: Dict, resume_text: str) -> ParsedResume:
        """Convert parsed JSON to ParsedResume model"""
        # Simplified conversion - would need full implementation
        return ParsedResume(
            contact_info=ContactInfo(),
            raw_text=resume_text
        )
    
    def _calculate_ocr_quality(self, result) -> float:
        """Calculate OCR quality score"""
        try:
            # Simplified quality calculation based on confidence scores
            total_confidence = 0
            line_count = 0
            
            for page in result.pages:
                for line in page.lines:
                    if hasattr(line, 'confidence'):
                        total_confidence += line.confidence
                        line_count += 1
            
            return total_confidence / line_count if line_count > 0 else 0.0
        except:
            return 0.5  # Default moderate confidence
    
    def get_health(self) -> Dict[str, Any]:
        """Get service health status"""
        status = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "resume_service",
            "dependencies": {}
        }
        
        # Check Groq client
        if self.groq_client:
            status["dependencies"]["groq"] = "connected"
        else:
            status["dependencies"]["groq"] = "unavailable"
            status["status"] = "degraded"
        
        # Check Azure client
        if self.azure_client:
            status["dependencies"]["azure_ocr"] = "connected"
        else:
            status["dependencies"]["azure_ocr"] = "unavailable"
            status["status"] = "degraded"
        
        return status
    
    def get_llm_status(self) -> Dict[str, Any]:
        """Get LLM service detailed status"""
        return {
            "service": "groq_llm",
            "status": "connected" if self.groq_client else "unavailable",
            "model": self.config.GROQ_MODEL,
            "max_tokens": self.config.MAX_TOKENS,
            "temperature": self.config.TEMPERATURE
        }
    
    def get_ocr_status(self) -> Dict[str, Any]:
        """Get OCR service detailed status"""
        return {
            "service": "azure_document_intelligence",
            "status": "connected" if self.azure_client else "unavailable",
            "endpoint": self.config.AZURE_DOC_INTELLIGENCE_ENDPOINT
        }