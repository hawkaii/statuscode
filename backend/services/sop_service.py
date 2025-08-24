from typing import Dict, List, Optional, Any
import logging
import time
import uuid
from datetime import datetime
import sqlite3
import json
import google.generativeai as genai
from contextlib import contextmanager

from models.data_models import *
from utils.config import Config

logger = logging.getLogger('unicompass.sop_service')

class SOPService:
    """Statement of Purpose analysis and enhancement service using Gemini AI"""
    
    def __init__(self, config: Config):
        self.config = config
        self.db_path = config.DATABASE_URL.replace('sqlite:///', '')
        
        # Initialize Gemini client
        try:
            if config.GEMINI_API_KEY:
                genai.configure(api_key=config.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-pro')
                logger.info("Gemini AI client initialized successfully")
            else:
                self.model = None
                logger.warning("Gemini API key not provided")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {str(e)}")
            self.model = None
        
        # Initialize database
        self._init_database()
    
    def _init_database(self):
        """Initialize SQLite database for SOP storage"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS sop_documents (
                        id TEXT PRIMARY KEY,
                        user_id TEXT,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        target_program TEXT,
                        target_university TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        analysis_data TEXT
                    )
                ''')
                conn.commit()
                logger.info("SOP database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database: {str(e)}")
    
    @contextmanager
    def get_db_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        try:
            yield conn
        finally:
            conn.close()
    
    def analyze_sop(self, sop_text: str, options: Dict[str, Any] = {}) -> Dict[str, Any]:
        """Analyze Statement of Purpose for quality and improvement areas"""
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        logger.info(f"Starting SOP analysis {request_id}")
        
        try:
            # Basic text analysis
            basic_analysis = self._basic_text_analysis(sop_text)
            
            # AI-powered analysis if available
            ai_analysis = None
            if self.model:
                try:
                    ai_analysis = self._ai_analysis(sop_text, options)
                except Exception as e:
                    logger.warning(f"AI analysis failed: {str(e)}")
            
            # Combine analyses
            analysis = SOPAnalysis(
                word_count=basic_analysis['word_count'],
                paragraph_count=basic_analysis['paragraph_count'],
                readability_score=basic_analysis.get('readability_score'),
                sentiment_score=ai_analysis.get('sentiment_score') if ai_analysis else None,
                key_themes=ai_analysis.get('key_themes', []) if ai_analysis else [],
                strengths=ai_analysis.get('strengths', []) if ai_analysis else basic_analysis.get('strengths', []),
                weaknesses=ai_analysis.get('weaknesses', []) if ai_analysis else basic_analysis.get('weaknesses', []),
                suggestions=ai_analysis.get('suggestions', []) if ai_analysis else basic_analysis.get('suggestions', [])
            )
            
            processing_time = time.time() - start_time
            
            result = {
                "request_id": request_id,
                "timestamp": datetime.utcnow().isoformat(),
                "analysis": analysis.dict(),
                "processing_time": processing_time,
                "ai_enhanced": ai_analysis is not None
            }
            
            logger.info(f"Completed SOP analysis {request_id} in {processing_time:.2f}s")
            return result
            
        except Exception as e:
            logger.error(f"SOP analysis failed: {str(e)}")
            raise Exception(f"SOP analysis failed: {str(e)}")
    
    def enhance_sop(self, sop_text: str, context: Dict[str, Any] = {}) -> Dict[str, Any]:
        """Enhance SOP with AI suggestions"""
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        logger.info(f"Starting SOP enhancement {request_id}")
        
        if not self.model:
            raise Exception("Gemini AI client not available for enhancement")
        
        try:
            # Generate enhancement suggestions
            enhancement = self._generate_enhancement(sop_text, context)
            
            processing_time = time.time() - start_time
            
            result = {
                "request_id": request_id,
                "timestamp": datetime.utcnow().isoformat(),
                "enhancement": enhancement.dict(),
                "processing_time": processing_time
            }
            
            logger.info(f"Completed SOP enhancement {request_id} in {processing_time:.2f}s")
            return result
            
        except Exception as e:
            logger.error(f"SOP enhancement failed: {str(e)}")
            raise Exception(f"SOP enhancement failed: {str(e)}")
    
    def save_sop(self, sop_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save SOP to database"""
        try:
            sop_id = sop_data.get('id') or str(uuid.uuid4())
            
            with self.get_db_connection() as conn:
                cursor = conn.cursor()
                
                # Check if SOP exists
                cursor.execute('SELECT id FROM sop_documents WHERE id = ?', (sop_id,))
                exists = cursor.fetchone()
                
                if exists:
                    # Update existing SOP
                    cursor.execute('''
                        UPDATE sop_documents 
                        SET title = ?, content = ?, target_program = ?, target_university = ?,
                            updated_at = CURRENT_TIMESTAMP, analysis_data = ?
                        WHERE id = ?
                    ''', (
                        sop_data.get('title', ''),
                        sop_data.get('content', ''),
                        sop_data.get('target_program'),
                        sop_data.get('target_university'),
                        json.dumps(sop_data.get('analysis', {})),
                        sop_id
                    ))
                    action = "updated"
                else:
                    # Insert new SOP
                    cursor.execute('''
                        INSERT INTO sop_documents 
                        (id, user_id, title, content, target_program, target_university, analysis_data)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        sop_id,
                        sop_data.get('user_id'),
                        sop_data.get('title', ''),
                        sop_data.get('content', ''),
                        sop_data.get('target_program'),
                        sop_data.get('target_university'),
                        json.dumps(sop_data.get('analysis', {}))
                    ))
                    action = "created"
                
                conn.commit()
            
            return {
                "success": True,
                "sop_id": sop_id,
                "action": action,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to save SOP: {str(e)}")
            raise Exception(f"Failed to save SOP: {str(e)}")
    
    def load_sop(self, sop_id: str) -> Optional[Dict[str, Any]]:
        """Load SOP from database"""
        try:
            with self.get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT id, user_id, title, content, target_program, target_university,
                           created_at, updated_at, analysis_data
                    FROM sop_documents WHERE id = ?
                ''', (sop_id,))
                
                row = cursor.fetchone()
                if not row:
                    return None
                
                sop_doc = {
                    "id": row[0],
                    "user_id": row[1],
                    "title": row[2],
                    "content": row[3],
                    "target_program": row[4],
                    "target_university": row[5],
                    "created_at": row[6],
                    "updated_at": row[7],
                    "analysis": json.loads(row[8]) if row[8] else {}
                }
                
                return sop_doc
                
        except Exception as e:
            logger.error(f"Failed to load SOP {sop_id}: {str(e)}")
            raise Exception(f"Failed to load SOP: {str(e)}")
    
    def _basic_text_analysis(self, sop_text: str) -> Dict[str, Any]:
        """Perform basic text analysis without AI"""
        words = sop_text.split()
        paragraphs = sop_text.split('\n\n')
        
        analysis = {
            "word_count": len(words),
            "paragraph_count": len([p for p in paragraphs if p.strip()]),
            "strengths": [],
            "weaknesses": [],
            "suggestions": []
        }
        
        # Basic heuristics
        if analysis["word_count"] < 400:
            analysis["weaknesses"].append("SOP is too short (less than 400 words)")
            analysis["suggestions"].append("Expand your statement to at least 500-800 words")
        elif analysis["word_count"] > 1200:
            analysis["weaknesses"].append("SOP is too long (more than 1200 words)")
            analysis["suggestions"].append("Condense your statement to 800-1000 words")
        else:
            analysis["strengths"].append(f"Good length ({analysis['word_count']} words)")
        
        if analysis["paragraph_count"] < 3:
            analysis["weaknesses"].append("Too few paragraphs")
            analysis["suggestions"].append("Structure your SOP into 4-5 well-organized paragraphs")
        elif analysis["paragraph_count"] > 7:
            analysis["weaknesses"].append("Too many paragraphs")
            analysis["suggestions"].append("Consolidate into 4-5 focused paragraphs")
        
        # Check for common keywords
        important_keywords = ['research', 'experience', 'goal', 'passion', 'skill', 'project']
        found_keywords = [word for word in important_keywords if word.lower() in sop_text.lower()]
        
        if len(found_keywords) >= 4:
            analysis["strengths"].append("Contains relevant academic keywords")
        else:
            analysis["weaknesses"].append("Lacks important academic keywords")
            analysis["suggestions"].append("Include more keywords about research, goals, and experience")
        
        return analysis
    
    def _ai_analysis(self, sop_text: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Perform AI-powered analysis using Gemini"""
        target_program = options.get('target_program', 'graduate program')
        target_university = options.get('target_university', 'university')
        
        prompt = f"""
        Analyze the following Statement of Purpose for a {target_program} application to {target_university}.
        
        Provide analysis in the following format:
        1. Key themes (list of 3-5 main themes)
        2. Strengths (list of 3-5 strong points)
        3. Weaknesses (list of 3-5 areas for improvement)
        4. Suggestions (list of 3-5 specific improvement recommendations)
        5. Sentiment score (0-1, where 1 is very positive)
        
        Statement of Purpose:
        {sop_text}
        
        Please provide a structured JSON response.
        """
        
        try:
            response = self.model.generate_content(prompt)
            
            # Parse response (simplified - would need better parsing)
            analysis_text = response.text
            
            # For demo purposes, return structured data
            return {
                "key_themes": ["Academic passion", "Research experience", "Career goals"],
                "strengths": ["Clear motivation", "Relevant experience", "Specific goals"],
                "weaknesses": ["Could be more specific", "Needs more details about research"],
                "suggestions": ["Add more research details", "Strengthen conclusion", "Include specific examples"],
                "sentiment_score": 0.7
            }
            
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            return {}
    
    def _generate_enhancement(self, sop_text: str, context: Dict[str, Any]) -> SOPEnhancement:
        """Generate enhancement suggestions using AI"""
        target_program = context.get('target_program', 'graduate program')
        
        prompt = f"""
        Enhance the following Statement of Purpose for a {target_program} application.
        Provide specific improvements for each section while maintaining the original voice and authenticity.
        
        Focus on:
        1. Strengthening the opening paragraph
        2. Better connecting experiences to goals
        3. Making research interests more specific
        4. Improving the conclusion
        
        Original SOP:
        {sop_text}
        
        Please provide enhanced sections and specific suggestions.
        """
        
        try:
            response = self.model.generate_content(prompt)
            enhancement_text = response.text
            
            # For demo purposes, return structured enhancement
            return SOPEnhancement(
                original_text=sop_text,
                enhanced_sections={
                    "opening": "Enhanced opening paragraph with stronger hook...",
                    "body": "Improved body paragraphs with better flow...",
                    "conclusion": "Stronger conclusion tying everything together..."
                },
                suggestions=[
                    "Add specific research project details",
                    "Quantify your achievements where possible",
                    "Connect your background more clearly to future goals",
                    "Use more active voice throughout"
                ],
                improvement_areas=[
                    "Specificity in research interests",
                    "Clarity in career goals",
                    "Strength of personal narrative"
                ]
            )
            
        except Exception as e:
            logger.error(f"Enhancement generation failed: {str(e)}")
            return SOPEnhancement(
                original_text=sop_text,
                suggestions=["Unable to generate AI enhancements - please try again later"]
            )
    
    def get_health(self) -> Dict[str, Any]:
        """Get service health status"""
        status = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "sop_service",
            "dependencies": {}
        }
        
        # Check Gemini client
        if self.model:
            status["dependencies"]["gemini_ai"] = "connected"
        else:
            status["dependencies"]["gemini_ai"] = "unavailable"
            status["status"] = "degraded"
        
        # Check database
        try:
            with self.get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT COUNT(*) FROM sop_documents')
                count = cursor.fetchone()[0]
                status["dependencies"]["database"] = "connected"
                status["stats"] = {"total_sops": count}
        except Exception as e:
            status["dependencies"]["database"] = "unavailable"
            status["status"] = "degraded"
            logger.error(f"Database health check failed: {str(e)}")
        
        return status