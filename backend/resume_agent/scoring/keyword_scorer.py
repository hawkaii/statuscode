import re

# Skill dictionaries by category
TECHNICAL_SKILLS = [
    "Python", "Java", "SQL", "React", "AWS", "JavaScript", "HTML", "CSS",
    "Git", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Flask", "Django"
]

SOFT_SKILLS = [
    "Leadership", "Communication", "Teamwork", "Problem Solving", 
    "Critical Thinking", "Adaptability", "Time Management", "Collaboration"
]

INDUSTRY_SKILLS = [
    "Project Management", "Data Analysis", "Machine Learning", "Agile",
    "Scrum", "DevOps", "Cloud Computing", "API Development", "Testing"
]

# Calculate keyword matching score (40 points max)
# Based on keyword density and variety

def calculate_keyword_score(resume_text):
    resume_lower = resume_text.lower()
    
    # Count matches in each category
    technical_matches = []
    soft_matches = []
    industry_matches = []
    
    for skill in TECHNICAL_SKILLS:
        if skill.lower() in resume_lower:
            technical_matches.append(skill)
    
    for skill in SOFT_SKILLS:
        if skill.lower() in resume_lower:
            soft_matches.append(skill)
            
    for skill in INDUSTRY_SKILLS:
        if skill.lower() in resume_lower:
            industry_matches.append(skill)
    
    # Calculate scores based on variety and count
    technical_score = min(len(technical_matches) * 3, 20)  # Max 20 points
    soft_score = min(len(soft_matches) * 2, 10)           # Max 10 points  
    industry_score = min(len(industry_matches) * 2, 10)   # Max 10 points
    
    total_score = technical_score + soft_score + industry_score
    
    feedback = []
    if len(technical_matches) == 0:
        feedback.append("Add more technical skills like 'Python', 'SQL', or 'React'")
    elif len(technical_matches) < 3:
        feedback.append("Consider adding more technical keywords to improve ATS matching")
        
    if len(soft_matches) == 0:
        feedback.append("Include soft skills like 'Leadership' or 'Communication'")
        
    if len(industry_matches) == 0:
        feedback.append("Add industry-specific keywords like 'Project Management' or 'Agile'")
    
    return total_score, feedback, {
        'technical_skills': technical_matches,
        'soft_skills': soft_matches,
        'industry_skills': industry_matches
    }
