from .llm_service import llm_service
from .resume_parser import ParsedResume
from typing import Dict, List

class IntelligenceEnhancer:
    def __init__(self):
        self.llm = llm_service
    
    def generate_intelligent_feedback(self, parsed_resume: ParsedResume, traditional_score: int) -> Dict:
        """Generate intelligent feedback using LLM analysis"""
        if not self.llm.is_available():
            return self._fallback_feedback(traditional_score)
        
        try:
            prompt = self._create_feedback_prompt(parsed_resume, traditional_score)
            response = self.llm.generate_completion(prompt, max_tokens=800)
            feedback_data = self.llm.parse_json_response(response)
            
            return feedback_data
            
        except Exception as e:
            print(f"LLM feedback generation failed: {e}")
            return self._fallback_feedback(traditional_score)
    
    def _create_feedback_prompt(self, parsed_resume: ParsedResume, traditional_score: int) -> str:
        """Create prompt for intelligent feedback generation"""
        resume_summary = self._summarize_resume(parsed_resume)
        
        return f"""
        As an expert career counselor and ATS specialist, analyze this resume and provide intelligent feedback.

        Resume Summary:
        {resume_summary}

        Current ATS Score: {traditional_score}/100

        Please provide feedback in this JSON format:
        {{
            "overall_assessment": "string - overall impression and main areas for improvement",
            "strengths": ["array of specific strengths"],
            "improvements": ["array of specific, actionable improvements"],
            "ats_optimization": ["array of ATS-specific suggestions"],
            "career_advice": ["array of career development suggestions"],
            "priority_actions": ["top 3 most important actions to take"]
        }}

        Focus on:
        1. Specific, actionable advice
        2. ATS optimization
        3. Content quality and impact
        4. Professional presentation
        5. Career progression insights

        Return ONLY valid JSON.
        """
    
    def _summarize_resume(self, parsed_resume: ParsedResume) -> str:
        """Create a summary of parsed resume for LLM analysis"""
        summary_parts = []
        
        # Contact and basic info
        if parsed_resume.contact_info.name:
            summary_parts.append(f"Name: {parsed_resume.contact_info.name}")
        
        # Work experience
        if parsed_resume.work_experience:
            summary_parts.append(f"Work Experience: {len(parsed_resume.work_experience)} positions")
            for exp in parsed_resume.work_experience[:2]:  # First 2 positions
                summary_parts.append(f"- {exp.job_title} at {exp.company}")
        
        # Education
        if parsed_resume.education:
            summary_parts.append("Education:")
            for edu in parsed_resume.education:
                summary_parts.append(f"- {edu.degree} from {edu.institution}")
        
        # Skills
        if parsed_resume.skills.technical_skills:
            summary_parts.append(f"Technical Skills: {', '.join(parsed_resume.skills.technical_skills[:5])}")
        
        # Certifications
        if parsed_resume.certifications:
            summary_parts.append(f"Certifications: {len(parsed_resume.certifications)}")
        
        return "\n".join(summary_parts)
    
    def _fallback_feedback(self, score: int) -> Dict:
        """Fallback feedback when LLM is not available"""
        if score >= 80:
            assessment = "Strong resume with good ATS compatibility"
            improvements = ["Consider adding more quantified achievements", "Review for any minor formatting inconsistencies"]
        elif score >= 60:
            assessment = "Good foundation with room for improvement"
            improvements = ["Add more technical keywords", "Strengthen action verbs", "Include quantified achievements"]
        else:
            assessment = "Significant improvements needed for ATS optimization"
            improvements = ["Expand resume content", "Add relevant technical skills", "Improve formatting and structure"]
        
        return {
            "overall_assessment": assessment,
            "strengths": ["Basic structure present"],
            "improvements": improvements,
            "ats_optimization": ["Add more keywords", "Improve formatting"],
            "career_advice": ["Focus on measurable achievements"],
            "priority_actions": improvements[:3]
        }

# Global enhancer instance  
intelligence_enhancer = IntelligenceEnhancer()
