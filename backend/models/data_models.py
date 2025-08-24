from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class SkillCategory(str, Enum):
    TECHNICAL = "technical"
    SOFT = "soft"
    LANGUAGE = "language"
    TOOL = "tool"

class Skill(BaseModel):
    name: str
    category: SkillCategory
    level: Optional[str] = None
    years_experience: Optional[int] = None

class WorkExperience(BaseModel):
    company: str
    position: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration: Optional[str] = None
    description: List[str] = Field(default_factory=list)
    skills_used: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    graduation_date: Optional[str] = None
    gpa: Optional[float] = None
    relevant_coursework: List[str] = Field(default_factory=list)
    honors: List[str] = Field(default_factory=list)

class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class ParsedResume(BaseModel):
    contact_info: ContactInfo
    summary: Optional[str] = None
    work_experience: List[WorkExperience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skills: List[Skill] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)
    languages: List[Dict[str, str]] = Field(default_factory=list)
    raw_text: str = ""

class ATSScore(BaseModel):
    total_score: float = Field(ge=0, le=100)
    keyword_score: float = Field(ge=0, le=40)
    action_verb_score: float = Field(ge=0, le=25)
    length_score: float = Field(ge=0, le=20)
    format_score: float = Field(ge=0, le=15)
    breakdown: Dict[str, Any] = Field(default_factory=dict)

class Feedback(BaseModel):
    priority: str  # "high", "medium", "low"
    category: str
    message: str
    suggestion: str
    impact: str

class ResumeAnalysisResult(BaseModel):
    request_id: str
    timestamp: str
    parsed_resume: ParsedResume
    ats_score: ATSScore
    ai_insights: Optional[Dict[str, Any]] = None
    feedback: List[Feedback] = Field(default_factory=list)
    processing_time: float
    ocr_quality: Optional[float] = None

class AcademicProfile(BaseModel):
    gpa: float
    gre_verbal: Optional[int] = None
    gre_quantitative: Optional[int] = None
    gre_analytical: Optional[int] = None
    toefl_score: Optional[int] = None
    ielts_score: Optional[float] = None
    research_experience: bool = False
    publications: int = 0
    work_experience_years: float = 0
    undergraduate_gpa: Optional[float] = None
    major: Optional[str] = None
    target_program: Optional[str] = None

class UniversityPrediction(BaseModel):
    university_name: str
    program: Optional[str] = None
    admission_probability: float = Field(ge=0, le=1)
    tier: str  # "top", "middle", "safety"
    reasoning: Optional[str] = None
    requirements_met: Dict[str, bool] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)

class PredictionResult(BaseModel):
    request_id: str
    timestamp: str
    profile: AcademicProfile
    predictions: List[UniversityPrediction]
    overall_assessment: Optional[str] = None
    recommendations: List[str] = Field(default_factory=list)
    processing_time: float

class SOPAnalysis(BaseModel):
    word_count: int
    paragraph_count: int
    readability_score: Optional[float] = None
    sentiment_score: Optional[float] = None
    key_themes: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)

class SOPEnhancement(BaseModel):
    original_text: str
    enhanced_sections: Dict[str, str] = Field(default_factory=dict)
    suggestions: List[str] = Field(default_factory=list)
    improvement_areas: List[str] = Field(default_factory=list)

class SOPDocument(BaseModel):
    id: str
    user_id: Optional[str] = None
    title: str
    content: str
    target_program: Optional[str] = None
    target_university: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    analysis: Optional[SOPAnalysis] = None

class HealthCheck(BaseModel):
    status: str  # "healthy", "degraded", "unhealthy"
    timestamp: str
    service: str
    dependencies: Dict[str, str] = Field(default_factory=dict)
    error: Optional[str] = None