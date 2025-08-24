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
                self.model = genai.GenerativeModel('gemini-1.5-flash')
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
                suggestions=ai_analysis.get('suggestions', []) if ai_analysis else basic_analysis.get('suggestions', []),
                overall_score=ai_analysis.get('overall_score') if ai_analysis else None,
                academic_focus_score=ai_analysis.get('academic_focus_score') if ai_analysis else None,
                personal_narrative_score=ai_analysis.get('personal_narrative_score') if ai_analysis else None,
                research_alignment_score=ai_analysis.get('research_alignment_score') if ai_analysis else None,
                career_clarity_score=ai_analysis.get('career_clarity_score') if ai_analysis else None,
                writing_quality_score=ai_analysis.get('writing_quality_score') if ai_analysis else None
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
        You are an expert academic advisor analyzing a Statement of Purpose for a {target_program} application to {target_university}.
        
        Analyze the following Statement of Purpose and provide ONLY a valid JSON response with this exact structure:
        {{
            "key_themes": ["theme1", "theme2", "theme3", "theme4", "theme5"],
            "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
            "weaknesses": ["weakness1", "weakness2", "weakness3", "weakness4", "weakness5"],
            "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"],
            "sentiment_score": 0.8,
            "overall_score": 85,
            "academic_focus_score": 90,
            "personal_narrative_score": 80,
            "research_alignment_score": 85,
            "career_clarity_score": 88,
            "writing_quality_score": 87
        }}
        
        Evaluation Criteria:
        - Key themes: Identify 3-5 main themes or topics discussed
        - Strengths: Highlight what makes this SOP compelling and strong
        - Weaknesses: Identify areas that need improvement or are missing
        - Suggestions: Provide specific, actionable improvement recommendations
        - Sentiment score: 0-1 scale measuring positivity and enthusiasm
        - Overall score: 0-100 comprehensive quality assessment
        - Academic focus score: How well it demonstrates academic readiness
        - Personal narrative score: Strength of personal story and motivation
        - Research alignment score: How well research interests are articulated
        - Career clarity score: Clarity of future goals and plans
        - Writing quality score: Grammar, structure, and clarity
        
        Statement of Purpose:
        {sop_text}
        
        Respond ONLY with valid JSON, no additional text or markdown.
        """
        
        try:
            response = self.model.generate_content(prompt)
            analysis_text = response.text.strip()
            
            # Clean up the response to ensure it's valid JSON
            if analysis_text.startswith('```json'):
                analysis_text = analysis_text[7:]
            if analysis_text.endswith('```'):
                analysis_text = analysis_text[:-3]
            
            analysis_text = analysis_text.strip()
            
            # Try to parse the JSON response
            try:
                analysis_data = json.loads(analysis_text)
                
                # Validate and clean the response
                validated_analysis = {
                    "key_themes": analysis_data.get("key_themes", [])[:5],
                    "strengths": analysis_data.get("strengths", [])[:5],
                    "weaknesses": analysis_data.get("weaknesses", [])[:5],
                    "suggestions": analysis_data.get("suggestions", [])[:5],
                    "sentiment_score": min(max(float(analysis_data.get("sentiment_score", 0.5)), 0.0), 1.0),
                    "overall_score": min(max(int(analysis_data.get("overall_score", 70)), 0), 100),
                    "academic_focus_score": min(max(int(analysis_data.get("academic_focus_score", 70)), 0), 100),
                    "personal_narrative_score": min(max(int(analysis_data.get("personal_narrative_score", 70)), 0), 100),
                    "research_alignment_score": min(max(int(analysis_data.get("research_alignment_score", 70)), 0), 100),
                    "career_clarity_score": min(max(int(analysis_data.get("career_clarity_score", 70)), 0), 100),
                    "writing_quality_score": min(max(int(analysis_data.get("writing_quality_score", 70)), 0), 100)
                }
                
                return validated_analysis
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response as JSON: {str(e)}")
                logger.error(f"Raw response: {analysis_text}")
                return self._fallback_analysis(sop_text)
            
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            return self._fallback_analysis(sop_text)
    
    def _fallback_analysis(self, sop_text: str) -> Dict[str, Any]:
        """Provide fallback analysis when AI fails"""
        words = sop_text.split()
        word_count = len(words)
        
        # Basic sentiment analysis
        positive_words = ['passion', 'excited', 'enthusiastic', 'motivated', 'dedicated', 'committed', 'eager', 'inspire', 'dream']
        sentiment_count = sum(1 for word in words if word.lower() in positive_words)
        sentiment_score = min(sentiment_count / 20.0, 1.0)
        
        # Basic scoring
        base_score = 60
        if 400 <= word_count <= 800:
            base_score += 10
        if 'research' in sop_text.lower():
            base_score += 10
        if 'university' in sop_text.lower():
            base_score += 5
            
        return {
            "key_themes": ["Academic interests", "Career goals", "Personal motivation"],
            "strengths": ["Shows motivation", "Relevant academic background"],
            "weaknesses": ["Could be more specific", "Needs stronger conclusion"],
            "suggestions": ["Add more concrete examples", "Strengthen research discussion"],
            "sentiment_score": sentiment_score,
            "overall_score": min(base_score, 100),
            "academic_focus_score": base_score - 5,
            "personal_narrative_score": base_score - 10,
            "research_alignment_score": base_score - 8,
            "career_clarity_score": base_score - 5,
            "writing_quality_score": base_score
        }
    
    def _generate_enhancement(self, sop_text: str, context: Dict[str, Any]) -> SOPEnhancement:
        """Generate enhancement suggestions using AI"""
        target_program = context.get('target_program', 'graduate program')
        target_university = context.get('target_university', 'university')
        
        prompt = f"""
        You are an expert academic writing consultant. Enhance the following Statement of Purpose for a {target_program} application to {target_university}.
        
        Provide ONLY a valid JSON response with this exact structure:
        {{
            "enhanced_sections": {{
                "opening": "Enhanced opening paragraph...",
                "academic_background": "Enhanced academic background section...",
                "research_experience": "Enhanced research experience section...",
                "future_goals": "Enhanced future goals section...",
                "conclusion": "Enhanced conclusion paragraph..."
            }},
            "suggestions": [
                "Specific suggestion 1",
                "Specific suggestion 2",
                "Specific suggestion 3",
                "Specific suggestion 4",
                "Specific suggestion 5"
            ],
            "improvement_areas": [
                "Area 1",
                "Area 2", 
                "Area 3",
                "Area 4",
                "Area 5"
            ]
        }}
        
        Enhancement Guidelines:
        - Maintain the applicant's authentic voice and experiences
        - Strengthen transitions between paragraphs
        - Make research interests more specific and compelling
        - Better connect past experiences to future goals
        - Use more active voice and concrete examples
        - Ensure proper academic tone throughout
        
        Original SOP:
        {sop_text}
        
        Respond ONLY with valid JSON, no additional text or markdown.
        """
        
        try:
            response = self.model.generate_content(prompt)
            enhancement_text = response.text.strip()
            
            # Clean up the response
            if enhancement_text.startswith('```json'):
                enhancement_text = enhancement_text[7:]
            if enhancement_text.endswith('```'):
                enhancement_text = enhancement_text[:-3]
            
            enhancement_text = enhancement_text.strip()
            
            try:
                enhancement_data = json.loads(enhancement_text)
                
                return SOPEnhancement(
                    original_text=sop_text,
                    enhanced_sections=enhancement_data.get('enhanced_sections', {}),
                    suggestions=enhancement_data.get('suggestions', [])[:5],
                    improvement_areas=enhancement_data.get('improvement_areas', [])[:5]
                )
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse enhancement JSON: {str(e)}")
                return self._fallback_enhancement(sop_text)
            
        except Exception as e:
            logger.error(f"Enhancement generation failed: {str(e)}")
            return self._fallback_enhancement(sop_text)
    
    def _fallback_enhancement(self, sop_text: str) -> SOPEnhancement:
        """Provide fallback enhancement when AI fails"""
        return SOPEnhancement(
            original_text=sop_text,
            enhanced_sections={
                "opening": "Consider starting with a compelling hook that connects your passion to a specific experience...",
                "academic_background": "Quantify your academic achievements and relate them to your target program...",
                "research_experience": "Provide specific details about research projects, methodologies, and outcomes...",
                "future_goals": "Connect your past experiences to specific research interests and career objectives...",
                "conclusion": "End with a strong statement that ties everything together..."
            },
            suggestions=[
                "Use more specific examples and quantify achievements where possible",
                "Strengthen the connection between past experiences and future goals",
                "Add more details about research methodology and outcomes",
                "Improve paragraph transitions for better flow",
                "Use more active voice throughout the statement"
            ],
            improvement_areas=[
                "Specificity in research interests",
                "Quantification of achievements",
                "Clarity in career goals",
                "Strength of personal narrative",
                "Academic writing style"
            ]
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