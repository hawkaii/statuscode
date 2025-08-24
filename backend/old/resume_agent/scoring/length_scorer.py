# Calculate length-based score (20 points max)
# Optimal: 400-800 words = full points
# Penalty for too short (<300) or too long (>1200)

def calculate_length_score(resume_text):
    words = resume_text.split()
    word_count = len(words)
    
    if 400 <= word_count <= 800:
        score = 20  # Perfect length
    elif 300 <= word_count < 400:
        score = 15  # Slightly short
    elif 800 < word_count <= 1000:
        score = 15  # Slightly long
    elif 1000 < word_count <= 1200:
        score = 10  # Too long
    elif word_count < 300:
        score = 5   # Too short
    else:  # > 1200 words
        score = 5   # Way too long
    
    feedback = []
    if word_count < 300:
        feedback.append(f"Resume is too short ({word_count} words). Aim for 400-800 words.")
    elif word_count > 1200:
        feedback.append(f"Resume is too long ({word_count} words). Keep it under 800 words.")
    elif 400 <= word_count <= 800:
        feedback.append(f"Resume length is optimal ({word_count} words).")
    
    return score, feedback
