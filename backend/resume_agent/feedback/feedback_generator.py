from .feedback_templates import (
    LENGTH_FEEDBACK, KEYWORD_FEEDBACK, ACTION_VERB_FEEDBACK, 
    FORMAT_FEEDBACK, OVERALL_FEEDBACK, SKILL_SUGGESTIONS,
    PRIORITY_HIGH, PRIORITY_MEDIUM, PRIORITY_LOW
)
import random

class FeedbackGenerator:
    def __init__(self):
        self.feedback_items = []
    
    def generate_comprehensive_feedback(self, analysis_result):
        """
        Generate prioritized, actionable feedback based on analysis results
        """
        self.feedback_items = []
        
        # Extract scores and details
        scores = analysis_result['breakdown']
        keyword_details = analysis_result.get('keyword_details', {})
        total_score = analysis_result['score']
        
        # Generate feedback for each component
        self._generate_length_feedback(analysis_result.get('word_count', 0))
        self._generate_keyword_feedback(scores['keyword_score'], keyword_details)
        self._generate_action_verb_feedback(scores['action_verb_score'], analysis_result.get('action_verb_details', {}))
        self._generate_format_feedback(scores['format_score'], analysis_result.get('format_details', {}))
        self._generate_overall_feedback(total_score)
        
        # Sort feedback by priority (high priority first)
        self.feedback_items.sort(key=lambda x: x['priority'])
        
        # Return formatted feedback
        return {
            'feedback': [item['message'] for item in self.feedback_items],
            'feedback_by_category': self._group_by_category(),
            'improvement_priority': self._get_improvement_priorities()
        }
    
    def _generate_length_feedback(self, word_count):
        """Generate feedback for resume length"""
        if word_count < 300:
            template = LENGTH_FEEDBACK['too_short']
            message = template['message'].format(word_count=word_count)
            self._add_feedback(message, template['priority'], template['category'])
        elif word_count > 1200:
            template = LENGTH_FEEDBACK['too_long']
            message = template['message'].format(word_count=word_count)
            self._add_feedback(message, template['priority'], template['category'])
        elif 400 <= word_count <= 800:
            template = LENGTH_FEEDBACK['optimal']
            message = template['message'].format(word_count=word_count)
            self._add_feedback(message, template['priority'], template['category'])
    
    def _generate_keyword_feedback(self, keyword_score, keyword_details):
        """Generate feedback for keywords"""
        technical_skills = keyword_details.get('technical_skills', [])
        soft_skills = keyword_details.get('soft_skills', [])
        industry_skills = keyword_details.get('industry_skills', [])
        
        # Technical skills feedback
        if len(technical_skills) == 0:
            template = KEYWORD_FEEDBACK['no_technical']
            self._add_feedback(template['message'], template['priority'], template['category'])
        elif len(technical_skills) < 3:
            template = KEYWORD_FEEDBACK['few_technical']
            suggestions = random.sample(SKILL_SUGGESTIONS['technical'], 3)
            message = template['message'].format(
                skills=', '.join(technical_skills),
                suggestions=', '.join(suggestions)
            )
            self._add_feedback(message, template['priority'], template['category'])
        
        # Soft skills feedback
        if len(soft_skills) == 0:
            template = KEYWORD_FEEDBACK['no_soft']
            self._add_feedback(template['message'], template['priority'], template['category'])
        
        # Industry skills feedback
        if len(industry_skills) == 0:
            template = KEYWORD_FEEDBACK['no_industry']
            self._add_feedback(template['message'], template['priority'], template['category'])
        
        # Positive feedback for good coverage
        if len(technical_skills) >= 3 and len(soft_skills) >= 2 and len(industry_skills) >= 2:
            template = KEYWORD_FEEDBACK['good_coverage']
            self._add_feedback(template['message'], template['priority'], template['category'])
    
    def _generate_action_verb_feedback(self, action_verb_score, action_verb_details):
        """Generate feedback for action verbs"""
        strong_verb_count = action_verb_details.get('strong_verb_count', 0)
        weak_phrase_count = action_verb_details.get('weak_phrase_count', 0)
        
        if strong_verb_count == 0:
            template = ACTION_VERB_FEEDBACK['no_strong_verbs']
            self._add_feedback(template['message'], template['priority'], template['category'])
        elif weak_phrase_count > 0:
            template = ACTION_VERB_FEEDBACK['weak_phrases_found']
            self._add_feedback(template['message'], template['priority'], template['category'])
        elif strong_verb_count < 3:
            template = ACTION_VERB_FEEDBACK['few_strong_verbs']
            self._add_feedback(template['message'], template['priority'], template['category'])
        else:
            template = ACTION_VERB_FEEDBACK['good_verbs']
            self._add_feedback(template['message'], template['priority'], template['category'])
    
    def _generate_format_feedback(self, format_score, format_details):
        """Generate feedback for formatting"""
        missing_sections = format_details.get('missing_sections', [])
        has_contact = format_details.get('has_contact', True)
        
        if missing_sections:
            template = FORMAT_FEEDBACK['missing_sections']
            message = template['message'].format(missing_sections=', '.join(missing_sections))
            self._add_feedback(message, template['priority'], template['category'])
        
        if not has_contact:
            template = FORMAT_FEEDBACK['missing_contact']
            self._add_feedback(template['message'], template['priority'], template['category'])
        
        if not missing_sections and has_contact:
            template = FORMAT_FEEDBACK['good_structure']
            self._add_feedback(template['message'], template['priority'], template['category'])
    
    def _generate_overall_feedback(self, total_score):
        """Generate overall feedback based on total score"""
        if total_score >= 80:
            template = OVERALL_FEEDBACK['excellent']
        elif total_score >= 60:
            template = OVERALL_FEEDBACK['good']
        elif total_score >= 40:
            template = OVERALL_FEEDBACK['needs_work']
        else:
            template = OVERALL_FEEDBACK['poor']
        
        self._add_feedback(template['message'], template['priority'], template['category'])
    
    def _add_feedback(self, message, priority, category):
        """Add feedback item to the list"""
        self.feedback_items.append({
            'message': message,
            'priority': priority,
            'category': category
        })
    
    def _group_by_category(self):
        """Group feedback by category"""
        categories = {}
        for item in self.feedback_items:
            category = item['category']
            if category not in categories:
                categories[category] = []
            categories[category].append(item['message'])
        return categories
    
    def _get_improvement_priorities(self):
        """Get top 3 improvement priorities"""
        high_priority = [item['message'] for item in self.feedback_items if item['priority'] == PRIORITY_HIGH]
        return high_priority[:3]  # Return top 3 high priority items
