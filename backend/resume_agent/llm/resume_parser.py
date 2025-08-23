from .llm_service import llm_service
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import json

class WorkExperience(BaseModel):
    job_title: str
    company: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: List[str] = []
    achievements: List[str] = []

class Education(BaseModel):
    degree: str
    institution: str
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None
    relevant_coursework: List[str] = []

class Skills(BaseModel):
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    tools_and_technologies: List[str] = []
    programming_languages: List[str] = []

class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class ParsedResume(BaseModel):
    contact_info: ContactInfo
    work_experience: List[WorkExperience] = []
    education: List[Education] = []
    skills: Skills
    certifications: List[str] = []
    projects: List[str] = []
    summary: Optional[str] = None

class LLMResumeParser:
    def __init__(self):
        self.llm = llm_service
    
    def parse_resume(self, resume_text: str) -> ParsedResume:
        """Parse resume using LLM and return structured data"""
        if not self.llm.is_available():
            # Fallback to basic parsing if LLM not available
            return self._basic_parse_fallback(resume_text)
        
        try:
            prompt = self._create_parsing_prompt(resume_text)
            response = self.llm.generate_completion(prompt)
            parsed_data = self.llm.parse_json_response(response)
            
            # Validate and create ParsedResume object
            return ParsedResume(**parsed_data)
            
        except Exception as e:
            print(f"LLM parsing failed: {e}")
            # Fallback to basic parsing
            return self._basic_parse_fallback(resume_text)
    
    def _create_parsing_prompt(self, resume_text: str) -> str:
        """Create prompt for resume parsing"""
        return f"""
        Please analyze the following resume text and extract structured information. 
        Return the response as valid JSON matching this exact structure:

        {{
            "contact_info": {{
                "name": "string or null",
                "email": "string or null", 
                "phone": "string or null",
                "location": "string or null",
                "linkedin": "string or null",
                "github": "string or null"
            }},
            "work_experience": [
                {{
                    "job_title": "string",
                    "company": "string",
                    "start_date": "string or null",
                    "end_date": "string or null",
                    "description": ["string array"],
                    "achievements": ["string array"]
                }}
            ],
            "education": [
                {{
                    "degree": "string",
                    "institution": "string", 
                    "graduation_year": "string or null",
                    "gpa": "string or null",
                    "relevant_coursework": ["string array"]
                }}
            ],
            "skills": {{
                "technical_skills": ["string array"],
                "soft_skills": ["string array"],
                "tools_and_technologies": ["string array"],
                "programming_languages": ["string array"]
            }},
            "certifications": ["string array"],
            "projects": ["string array"],
            "summary": "string or null"
        }}

        Resume Text:
        {resume_text}

        Important: Return ONLY valid JSON, no additional text or formatting.
        """
    
    def _basic_parse_fallback(self, resume_text: str) -> ParsedResume:
        """Basic parsing fallback when LLM is not available"""
        import re
        
        # Basic contact info extraction
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text)
        phone_match = re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', resume_text)
        
        # Basic name extraction (assume first non-empty line)
        lines = resume_text.split('\n')
        name = lines[0].strip() if lines else None
        
        contact_info = ContactInfo(
            name=name,
            email=email_match.group() if email_match else None,
            phone=phone_match.group() if phone_match else None
        )
        
        # Basic skills extraction (very simple)
        common_skills = ["Python", "Java", "JavaScript", "SQL", "React", "AWS"]
        found_skills = [skill for skill in common_skills if skill.lower() in resume_text.lower()]
        
        skills = Skills(
            technical_skills=found_skills,
            programming_languages=[s for s in found_skills if s in ["Python", "Java", "JavaScript"]]
        )
        
        return ParsedResume(
            contact_info=contact_info,
            skills=skills,
            summary="Basic parsing used - LLM not available"
        )

# Global parser instance
resume_parser = LLMResumeParser()
