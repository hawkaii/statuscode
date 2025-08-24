import logging
import os
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class SOPService:
    def __init__(self):
        self.gemini_api_key = os.getenv('GEMINI_API_KEY', '')
        self.jwt_secret = os.getenv('JWT_SECRET', 'your-jwt-secret')
        
        # In-memory storage for demo (replace with database in production)
        self.user_history = {}
        self.examples = [
            {
                "title": "Leadership Example",
                "text": "During my undergraduate studies, I led a team of five in developing a mobile app for campus safety. This experience taught me the importance of clear communication and collaborative problem-solving, skills that will be invaluable in graduate research environments."
            },
            {
                "title": "Research Example",
                "text": "My passion for research was ignited when I joined the AI lab and contributed to a published paper on NLP sentiment analysis. Working alongside graduate students and faculty, I learned the rigorous methodology required for impactful research and discovered my specific interest in multimodal learning."
            },
            {
                "title": "Problem-Solving Example",
                "text": "When faced with a complex data visualization challenge during my internship, I developed an innovative approach using D3.js that reduced processing time by 60%. This experience reinforced my belief that creative problem-solving and technical expertise can drive meaningful impact."
            }
        ]
        
        logger.info("SOP service initialized")
    
    def is_gemini_available(self) -> bool:
        """Check if Gemini API is available"""
        return bool(self.gemini_api_key)
    
    def review_sop(self, draft: str, user_id: str) -> Dict[str, Any]:
        """
        Review SOP draft and provide feedback
        
        Args:
            draft: The SOP draft text
            user_id: User identifier
            
        Returns:
            Dictionary with review results
        """
        if not draft or not draft.strip():
            raise ValueError("SOP draft cannot be empty")
        
        if not user_id:
            raise ValueError("User ID is required")
        
        logger.info(f"Reviewing SOP for user: {user_id}")
        
        # Generate feedback using mock Gemini API or fallback logic
        if self.is_gemini_available():
            feedback_data = self._gemini_review_sop(draft)
        else:
            feedback_data = self._fallback_review_sop(draft)
        
        # Create history entry
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "draft": draft,
            "feedback": feedback_data["feedback"],
            "cues": feedback_data["cues"]
        }
        
        # Store in user history
        if user_id not in self.user_history:
            self.user_history[user_id] = []
        self.user_history[user_id].append(entry)
        
        logger.info(f"SOP review completed for user: {user_id}")
        return entry
    
    def suggest_improvements(self, revision: str, user_id: str) -> Dict[str, Any]:
        """
        Provide suggestions for SOP revision
        
        Args:
            revision: The revised SOP text
            user_id: User identifier
            
        Returns:
            Dictionary with suggestion results
        """
        if not revision or not revision.strip():
            raise ValueError("SOP revision cannot be empty")
        
        if not user_id:
            raise ValueError("User ID is required")
        
        logger.info(f"Generating suggestions for user: {user_id}")
        
        # Generate suggestions using mock Gemini API or fallback logic
        if self.is_gemini_available():
            feedback_data = self._gemini_review_sop(revision)
        else:
            feedback_data = self._fallback_review_sop(revision)
        
        # Create history entry
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "draft": revision,
            "feedback": feedback_data["feedback"],
            "cues": feedback_data["cues"]
        }
        
        # Store in user history
        if user_id not in self.user_history:
            self.user_history[user_id] = []
        self.user_history[user_id].append(entry)
        
        logger.info(f"Suggestions generated for user: {user_id}")
        return entry
    
    def get_examples(self) -> List[Dict[str, str]]:
        """Get SOP writing examples"""
        return self.examples
    
    def get_user_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's SOP history"""
        if not user_id:
            raise ValueError("User ID is required")
        
        return self.user_history.get(user_id, [])
    
    def _gemini_review_sop(self, draft: str) -> Dict[str, List[str]]:
        """
        Mock Gemini API call for SOP review
        In production, this would make actual API calls to Gemini
        """
        # TODO: Implement actual Gemini API integration
        logger.info("Using mock Gemini API for SOP review")
        
        return self._fallback_review_sop(draft)
    
    def _fallback_review_sop(self, draft: str) -> Dict[str, List[str]]:
        """
        Fallback logic for SOP review when Gemini is not available
        """
        feedback = []
        cues = []
        
        # Analyze draft length
        word_count = len(draft.split())
        if word_count < 100:
            feedback.append("Your SOP is too short. Aim for 300-500 words.")
            cues.append("What specific experiences shaped your academic interests?")
        elif word_count > 600:
            feedback.append("Consider condensing your SOP to focus on the most impactful points.")
        
        # Check for key components
        draft_lower = draft.lower()
        
        if 'passion' not in draft_lower and 'interest' not in draft_lower:
            feedback.append("Clearly articulate your passion and motivation for this field.")
            cues.append("What sparked your initial interest in this area?")
        
        if 'experience' not in draft_lower and 'project' not in draft_lower:
            feedback.append("Include specific examples of relevant experience or projects.")
            cues.append("Describe a meaningful project that demonstrates your skills.")
        
        if 'goal' not in draft_lower and 'future' not in draft_lower:
            feedback.append("Discuss your future goals and how this program fits your plans.")
            cues.append("Where do you see yourself in 5-10 years?")
        
        if 'research' not in draft_lower and 'learn' not in draft_lower:
            feedback.append("Show your commitment to learning and research.")
            cues.append("What specific research areas interest you most?")
        
        # Check for personal touch
        if 'i' not in draft_lower[:50]:  # Check first 50 characters
            feedback.append("Start with a compelling personal statement or anecdote.")
            cues.append("What personal story best illustrates your journey?")
        
        # Generic feedback if nothing specific found
        if not feedback:
            feedback = [
                "Strong foundation! Consider adding more specific examples.",
                "Excellent clarity. You might want to elaborate on your research interests.",
                "Good structure. Adding quantifiable achievements would strengthen your SOP."
            ]
            cues = [
                "What measurable impact have you made in your field?",
                "Which professors or research areas align with your interests?",
                "How will you contribute to the academic community?"
            ]
        
        return {
            "feedback": feedback[:5],  # Limit to 5 feedback points
            "cues": cues[:5]  # Limit to 5 cues
        }
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get service status information"""
        return {
            'status': 'healthy',
            'service': 'sop_agent',
            'gemini_available': self.is_gemini_available(),
            'total_users': len(self.user_history),
            'total_reviews': sum(len(history) for history in self.user_history.values())
        }

# Global instance
sop_service = SOPService()