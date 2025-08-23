"""
Template-based feedback system for generating actionable suggestions
"""

# Priority levels for feedback ordering
PRIORITY_HIGH = 1
PRIORITY_MEDIUM = 2  
PRIORITY_LOW = 3

# Length feedback templates
LENGTH_FEEDBACK = {
    'too_short': {
        'message': "Resume is too short ({word_count} words). Aim for 400-800 words by adding more detail to your experience and achievements.",
        'priority': PRIORITY_HIGH,
        'category': 'length'
    },
    'too_long': {
        'message': "Resume is too long ({word_count} words). Keep it concise - aim for 1-2 pages (400-800 words) by removing less relevant details.",
        'priority': PRIORITY_MEDIUM,
        'category': 'length'
    },
    'optimal': {
        'message': "✓ Resume length is optimal ({word_count} words)",
        'priority': PRIORITY_LOW,
        'category': 'length'
    }
}

# Keyword feedback templates  
KEYWORD_FEEDBACK = {
    'no_technical': {
        'message': "Add technical skills relevant to your field (e.g., 'Python', 'SQL', 'React', 'AWS')",
        'priority': PRIORITY_HIGH,
        'category': 'keywords'
    },
    'few_technical': {
        'message': "Consider adding more technical keywords. Current skills found: {skills}. Add others like {suggestions}",
        'priority': PRIORITY_MEDIUM,
        'category': 'keywords'
    },
    'no_soft': {
        'message': "Include soft skills like 'Leadership', 'Communication', or 'Problem Solving'",
        'priority': PRIORITY_MEDIUM,
        'category': 'keywords'
    },
    'no_industry': {
        'message': "Add industry-specific keywords like 'Project Management', 'Agile', or 'Data Analysis'",
        'priority': PRIORITY_MEDIUM,
        'category': 'keywords'
    },
    'good_coverage': {
        'message': "✓ Good keyword coverage across technical, soft, and industry skills",
        'priority': PRIORITY_LOW,
        'category': 'keywords'
    }
}

# Action verb feedback templates
ACTION_VERB_FEEDBACK = {
    'no_strong_verbs': {
        'message': "Use strong action verbs like 'Led', 'Developed', 'Implemented', 'Optimized' to start your bullet points",
        'priority': PRIORITY_HIGH,
        'category': 'action_verbs'
    },
    'weak_phrases_found': {
        'message': "Replace weak phrases like 'responsible for' and 'worked on' with strong action verbs",
        'priority': PRIORITY_HIGH,
        'category': 'action_verbs'
    },
    'few_strong_verbs': {
        'message': "Add more strong action verbs. Try 'Managed', 'Created', 'Improved', 'Delivered'",
        'priority': PRIORITY_MEDIUM,
        'category': 'action_verbs'
    },
    'good_verbs': {
        'message': "✓ Good use of strong action verbs throughout resume",
        'priority': PRIORITY_LOW,
        'category': 'action_verbs'
    }
}

# Format feedback templates
FORMAT_FEEDBACK = {
    'missing_sections': {
        'message': "Add these essential sections: {missing_sections}",
        'priority': PRIORITY_HIGH,
        'category': 'format'
    },
    'missing_contact': {
        'message': "Include complete contact information (email and phone number)",
        'priority': PRIORITY_HIGH,
        'category': 'format'
    },
    'good_structure': {
        'message': "✓ Resume has good structure with proper sections",
        'priority': PRIORITY_LOW,
        'category': 'format'
    }
}

# Overall score feedback
OVERALL_FEEDBACK = {
    'excellent': {
        'message': "🎉 Excellent! Your resume is well-optimized for ATS systems",
        'priority': PRIORITY_LOW,
        'category': 'overall'
    },
    'good': {
        'message': "👍 Good resume with room for improvement",
        'priority': PRIORITY_LOW,
        'category': 'overall'
    },
    'needs_work': {
        'message': "⚠️ Your resume needs improvements for better ATS compatibility",
        'priority': PRIORITY_LOW,
        'category': 'overall'
    },
    'poor': {
        'message': "🚨 Significant improvements needed for ATS optimization",
        'priority': PRIORITY_LOW,
        'category': 'overall'
    }
}

# Skill suggestions for different categories
SKILL_SUGGESTIONS = {
    'technical': ["Docker", "Kubernetes", "MongoDB", "Node.js", "TypeScript", "Git"],
    'soft': ["Time Management", "Adaptability", "Critical Thinking", "Collaboration"],
    'industry': ["DevOps", "Cloud Computing", "API Development", "Testing", "Scrum"]
}
