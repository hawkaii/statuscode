import re

def calculate_format_score(resume_text):
    """
    Calculate format quality score (15 points max)
    Check for section headers, contact info, consistent formatting
    Returns score, feedback, and detailed analysis
    """
    score = 0
    feedback = []
    
    # Check for section headers (5 points each, max 10)
    sections_found = []
    missing_sections = []
    section_patterns = {
        'Experience': [r'\bexperience\b', r'\bwork history\b', r'\bemployment\b'],
        'Education': [r'\beducation\b', r'\bacademic\b', r'\buniversity\b', r'\bcollege\b'],
        'Skills': [r'\bskills\b', r'\btechnical skills\b', r'\bcompetencies\b']
    }
    
    for section_name, patterns in section_patterns.items():
        section_found = False
        for pattern in patterns:
            if re.search(pattern, resume_text, re.IGNORECASE):
                sections_found.append(section_name)
                score += 3  # 3 points per section found
                section_found = True
                break
        if not section_found:
            missing_sections.append(section_name)
    
    score = min(score, 10)  # Max 10 points for sections
    
    # Check for contact information (5 points max)
    contact_score = 0
    has_email = False
    has_phone = False
    
    # Email pattern
    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text):
        contact_score += 2
        has_email = True
    
    # Phone pattern
    if re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', resume_text):
        contact_score += 2
        has_phone = True
    
    # Basic name pattern (assume first line or contains common name indicators)
    lines = resume_text.split('\n')
    if len(lines) > 0 and len(lines[0].strip()) > 0:
        contact_score += 1
    
    score += contact_score
    
    # Generate feedback
    if missing_sections:
        feedback.append(f"Consider adding these sections: {', '.join(missing_sections)}")
    
    has_contact = has_email and has_phone
    if not has_contact:
        feedback.append("Make sure to include complete contact information (email, phone)")
    
    # Detailed analysis for feedback generator
    details = {
        'missing_sections': missing_sections,
        'has_contact': has_contact,
        'sections_found': sections_found
    }
    
    return score, feedback, details
