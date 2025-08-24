import re

STRONG_VERBS = [
    "Led", "Developed", "Managed", "Implemented", "Optimized", "Created",
    "Designed", "Built", "Improved", "Achieved", "Delivered", "Launched"
]

WEAK_PHRASES = [
    "Responsible for", "Worked on", "Helped with", "Assisted in", 
    "Participated in", "Involved in", "Duties included"
]

def calculate_action_verb_score(resume_text):
    """
    Calculate action verb score (25 points max)
    Strong verbs = points, weak phrases = penalty
    Returns score, feedback, and detailed analysis
    """
    strong_verb_count = 0
    weak_phrase_count = 0
    
    # Count strong verbs
    for verb in STRONG_VERBS:
        pattern = r'\b' + re.escape(verb) + r'\b'
        matches = len(re.findall(pattern, resume_text, re.IGNORECASE))
        strong_verb_count += matches
    
    # Count weak phrases
    for phrase in WEAK_PHRASES:
        pattern = re.escape(phrase)
        matches = len(re.findall(pattern, resume_text, re.IGNORECASE))
        weak_phrase_count += matches
    
    # Calculate score
    strong_points = min(strong_verb_count * 3, 25)  # 3 points per strong verb, max 25
    weak_penalty = weak_phrase_count * 2            # 2 point penalty per weak phrase
    
    score = max(strong_points - weak_penalty, 0)   # Don't go below 0
    
    feedback = []
    if strong_verb_count < 3:
        feedback.append("Use stronger action verbs like 'Led', 'Developed', or 'Implemented'")
    if weak_phrase_count > 0:
        feedback.append("Replace weak phrases like 'responsible for' with strong action verbs")
    
    # Detailed analysis for feedback generator
    details = {
        'strong_verb_count': strong_verb_count,
        'weak_phrase_count': weak_phrase_count
    }
    
    return score, feedback, details
