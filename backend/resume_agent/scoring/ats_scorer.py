from .length_scorer import calculate_length_score
from .keyword_scorer import calculate_keyword_score
from .actionverb_scorer import calculate_action_verb_score
from .format_scorer import calculate_format_score
from feedback.feedback_generator import FeedbackGenerator
from llm.resume_parser import resume_parser
from llm.intelligence_enhancer import intelligence_enhancer

def analyze_resume(resume_text):
    """
    Enhanced ATS scoring with LLM intelligence
    Total possible score: 100 points
    """
    if not resume_text or not resume_text.strip():
        return {
            'score': 0,
            'feedback': ['Resume text is empty'],
            'breakdown': {
                'length_score': 0,
                'keyword_score': 0,
                'action_verb_score': 0,
                'format_score': 0
            },
            'feedback_by_category': {},
            'improvement_priority': ['Please provide resume text to analyze'],
            'llm_available': False
        }
    
    # Parse resume using LLM
    try:
        parsed_resume = resume_parser.parse_resume(resume_text)
        llm_available = True
    except Exception as e:
        print(f"Resume parsing failed: {e}")
        parsed_resume = None
        llm_available = False
    
    # Calculate traditional scores with detailed info
    length_score, length_feedback = calculate_length_score(resume_text)
    keyword_score, keyword_feedback, keyword_details = calculate_keyword_score(resume_text)
    action_verb_score, action_verb_feedback, action_verb_details = calculate_action_verb_score(resume_text)
    format_score, format_feedback, format_details = calculate_format_score(resume_text)
    
    # Enhance keyword scoring with LLM insights if available
    if parsed_resume and llm_available:
        keyword_score, keyword_details = _enhance_keyword_scoring(keyword_score, keyword_details, parsed_resume)
    
    # Combine scores
    total_score = length_score + keyword_score + action_verb_score + format_score
    
    # Get word count
    word_count = len(resume_text.split())
    
    # Prepare comprehensive analysis result
    analysis_result = {
        'score': total_score,
        'breakdown': {
            'length_score': length_score,
            'keyword_score': keyword_score, 
            'action_verb_score': action_verb_score,
            'format_score': format_score
        },
        'keyword_details': keyword_details,
        'word_count': word_count,
        'action_verb_details': action_verb_details,
        'format_details': format_details,
        'llm_available': llm_available
    }
    
    # Generate feedback - enhanced with LLM if available
    if llm_available and parsed_resume:
        # Get LLM-powered feedback
        llm_feedback = intelligence_enhancer.generate_intelligent_feedback(parsed_resume, total_score)
        
        # Combine traditional and LLM feedback
        feedback_result = _combine_feedback_sources(analysis_result, llm_feedback)
        
        # Add parsed resume data
        analysis_result['parsed_resume'] = _serialize_parsed_resume(parsed_resume)
    else:
        # Use traditional feedback generator
        feedback_generator = FeedbackGenerator()
        feedback_result = feedback_generator.generate_comprehensive_feedback(analysis_result)
    
    # Combine everything
    final_result = {
        **analysis_result,
        **feedback_result
    }
    
    return final_result

def _enhance_keyword_scoring(original_score, keyword_details, parsed_resume):
    """Enhance keyword scoring using LLM-parsed skills"""
    # Get LLM-identified skills
    llm_technical = parsed_resume.skills.technical_skills + parsed_resume.skills.programming_languages
    llm_soft = parsed_resume.skills.soft_skills
    llm_tools = parsed_resume.skills.tools_and_technologies
    
    # Combine with original findings
    enhanced_technical = list(set(keyword_details.get('technical_skills', []) + llm_technical))
    enhanced_soft = list(set(keyword_details.get('soft_skills', []) + llm_soft))
    enhanced_industry = list(set(keyword_details.get('industry_skills', []) + llm_tools))
    
    # Recalculate score with enhanced skills
    technical_score = min(len(enhanced_technical) * 3, 20)
    soft_score = min(len(enhanced_soft) * 2, 10)
    industry_score = min(len(enhanced_industry) * 2, 10)
    
    enhanced_score = technical_score + soft_score + industry_score
    
    enhanced_details = {
        'technical_skills': enhanced_technical,
        'soft_skills': enhanced_soft,
        'industry_skills': enhanced_industry
    }
    
    return enhanced_score, enhanced_details

def _combine_feedback_sources(analysis_result, llm_feedback):
    """Combine traditional scoring feedback with LLM insights"""
    # Create main feedback list starting with LLM assessment
    main_feedback = []
    
    # Add overall assessment
    if 'overall_assessment' in llm_feedback:
        main_feedback.append(f"📊 {llm_feedback['overall_assessment']}")
    
    # Add priority actions
    if 'priority_actions' in llm_feedback:
        main_feedback.extend([f"🎯 {action}" for action in llm_feedback['priority_actions']])
    
    # Add ATS optimization suggestions
    if 'ats_optimization' in llm_feedback:
        main_feedback.extend([f"🔧 {suggestion}" for suggestion in llm_feedback['ats_optimization']])
    
    # Combine feedback by category
    feedback_by_category = {
        'llm_strengths': llm_feedback.get('strengths', []),
        'llm_improvements': llm_feedback.get('improvements', []),
        'ats_optimization': llm_feedback.get('ats_optimization', []),
        'career_advice': llm_feedback.get('career_advice', [])
    }
    
    return {
        'feedback': main_feedback,
        'feedback_by_category': feedback_by_category,
        'improvement_priority': llm_feedback.get('priority_actions', []),
        'llm_insights': llm_feedback
    }

def _serialize_parsed_resume(parsed_resume):
    """Convert parsed resume to serializable format"""
    return {
        'contact_info': parsed_resume.contact_info.dict(),
        'work_experience_count': len(parsed_resume.work_experience),
        'education_count': len(parsed_resume.education),
        'technical_skills_count': len(parsed_resume.skills.technical_skills),
        'certifications_count': len(parsed_resume.certifications),
        'has_summary': parsed_resume.summary is not None
    }
