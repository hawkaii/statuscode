from typing import Dict, List, Optional, Any
import logging
import time
import uuid
from datetime import datetime
import random
import numpy as np

from models.data_models import *
from utils.config import Config

logger = logging.getLogger('unicompass.prediction_service')

class PredictionService:
    """University admission prediction service using ML-based models"""
    
    def __init__(self, config: Config):
        self.config = config
        self.cache = {}
        self.cache_size = config.CACHE_SIZE
        self.request_count = 0
        
        # Initialize mock ML model (in real implementation, this would load trained models)
        self.university_data = self._load_university_data()
        logger.info("Prediction service initialized with university database")
    
    def predict_universities(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict university admission probabilities based on academic profile"""
        start_time = time.time()
        request_id = str(uuid.uuid4())
        self.request_count += 1
        
        logger.info(f"Starting university prediction {request_id}")
        
        try:
            # Parse profile data
            profile = self._parse_academic_profile(profile_data)
            
            # Check cache
            cache_key = self._generate_cache_key(profile)
            if cache_key in self.cache:
                logger.info(f"Cache hit for prediction {request_id}")
                cached_result = self.cache[cache_key]
                cached_result["request_id"] = request_id
                cached_result["timestamp"] = datetime.utcnow().isoformat()
                return cached_result
            
            # Generate predictions
            predictions = []
            
            for university in self.university_data:
                prediction = self._predict_single_university(profile, university)
                predictions.append(prediction)
            
            # Sort by admission probability
            predictions.sort(key=lambda x: x.admission_probability, reverse=True)
            
            # Categorize into tiers
            self._categorize_predictions(predictions)
            
            # Generate overall assessment
            overall_assessment = self._generate_overall_assessment(profile, predictions)
            recommendations = self._generate_recommendations(profile, predictions)
            
            processing_time = time.time() - start_time
            
            result = PredictionResult(
                request_id=request_id,
                timestamp=datetime.utcnow().isoformat(),
                profile=profile,
                predictions=predictions,
                overall_assessment=overall_assessment,
                recommendations=recommendations,
                processing_time=processing_time
            )
            
            # Cache result
            self._cache_result(cache_key, result.dict())
            
            logger.info(f"Completed university prediction {request_id} in {processing_time:.2f}s")
            return result.dict()
            
        except Exception as e:
            logger.error(f"University prediction failed: {str(e)}")
            raise Exception(f"University prediction failed: {str(e)}")
    
    def _parse_academic_profile(self, profile_data: Dict[str, Any]) -> AcademicProfile:
        """Parse and validate academic profile data"""
        return AcademicProfile(
            gpa=profile_data.get('gpa', 0.0),
            gre_verbal=profile_data.get('gre_verbal'),
            gre_quantitative=profile_data.get('gre_quantitative'),
            gre_analytical=profile_data.get('gre_analytical'),
            toefl_score=profile_data.get('toefl_score'),
            ielts_score=profile_data.get('ielts_score'),
            research_experience=profile_data.get('research_experience', False),
            publications=profile_data.get('publications', 0),
            work_experience_years=profile_data.get('work_experience_years', 0),
            undergraduate_gpa=profile_data.get('undergraduate_gpa'),
            major=profile_data.get('major'),
            target_program=profile_data.get('target_program')
        )
    
    def _predict_single_university(self, profile: AcademicProfile, university: Dict[str, Any]) -> UniversityPrediction:
        """Predict admission probability for a single university"""
        
        # Simplified ML-like prediction algorithm
        base_score = 0.0
        requirements_met = {}
        
        # GPA factor (30% weight)
        if profile.gpa >= university['min_gpa']:
            gpa_factor = min((profile.gpa - university['min_gpa']) / (4.0 - university['min_gpa']), 1.0)
            base_score += gpa_factor * 0.3
            requirements_met['gpa'] = True
        else:
            requirements_met['gpa'] = False
        
        # GRE factor (25% weight)
        if profile.gre_verbal and profile.gre_quantitative:
            total_gre = profile.gre_verbal + profile.gre_quantitative
            if total_gre >= university['min_gre_total']:
                gre_factor = min((total_gre - university['min_gre_total']) / (340 - university['min_gre_total']), 1.0)
                base_score += gre_factor * 0.25
                requirements_met['gre'] = True
            else:
                requirements_met['gre'] = False
        else:
            requirements_met['gre'] = False
        
        # Language test factor (15% weight)
        language_score_met = False
        if profile.toefl_score and profile.toefl_score >= university.get('min_toefl', 80):
            language_score_met = True
        elif profile.ielts_score and profile.ielts_score >= university.get('min_ielts', 6.5):
            language_score_met = True
        
        if language_score_met:
            base_score += 0.15
        requirements_met['language_test'] = language_score_met
        
        # Research experience factor (15% weight)
        if profile.research_experience:
            base_score += 0.15
        if profile.publications > 0:
            base_score += min(profile.publications * 0.05, 0.1)
        requirements_met['research_experience'] = profile.research_experience
        
        # Work experience factor (10% weight)
        if profile.work_experience_years > 0:
            work_factor = min(profile.work_experience_years / 5.0, 1.0)
            base_score += work_factor * 0.1
        requirements_met['work_experience'] = profile.work_experience_years > 0
        
        # Program match factor (5% weight)
        if profile.target_program and profile.target_program.lower() in university.get('programs', []):
            base_score += 0.05
            requirements_met['program_match'] = True
        else:
            requirements_met['program_match'] = False
        
        # Add some randomness to simulate real-world variability
        noise = np.random.normal(0, 0.05)  # 5% standard deviation
        final_probability = max(0.0, min(1.0, base_score + noise))
        
        # Generate reasoning
        reasoning = self._generate_prediction_reasoning(profile, university, final_probability, requirements_met)
        
        # Generate recommendations
        recommendations = self._generate_university_recommendations(profile, university, requirements_met)
        
        return UniversityPrediction(
            university_name=university['name'],
            program=profile.target_program,
            admission_probability=final_probability,
            tier="",  # Will be set later in categorization
            reasoning=reasoning,
            requirements_met=requirements_met,
            recommendations=recommendations
        )
    
    def _categorize_predictions(self, predictions: List[UniversityPrediction]):
        """Categorize predictions into tiers based on admission probability"""
        for prediction in predictions:
            if prediction.admission_probability >= self.config.UNIVERSITY_TIERS['top']:
                prediction.tier = "top"
            elif prediction.admission_probability >= self.config.UNIVERSITY_TIERS['middle']:
                prediction.tier = "middle"
            else:
                prediction.tier = "safety"
    
    def _generate_prediction_reasoning(self, profile: AcademicProfile, university: Dict[str, Any], 
                                     probability: float, requirements_met: Dict[str, bool]) -> str:
        """Generate reasoning for the prediction"""
        reasons = []
        
        if requirements_met.get('gpa', False):
            reasons.append(f"GPA of {profile.gpa} meets requirements")
        else:
            reasons.append(f"GPA of {profile.gpa} is below minimum requirement")
        
        if requirements_met.get('gre', False):
            reasons.append("GRE scores are competitive")
        elif profile.gre_verbal and profile.gre_quantitative:
            reasons.append("GRE scores are below average for this university")
        
        if requirements_met.get('research_experience', False):
            reasons.append("Research experience strengthens application")
        
        if profile.publications > 0:
            reasons.append(f"{profile.publications} publications enhance research profile")
        
        return "; ".join(reasons)
    
    def _generate_university_recommendations(self, profile: AcademicProfile, university: Dict[str, Any], 
                                           requirements_met: Dict[str, bool]) -> List[str]:
        """Generate recommendations for improving admission chances"""
        recommendations = []
        
        if not requirements_met.get('gpa', False):
            recommendations.append("Consider taking additional coursework to improve GPA")
        
        if not requirements_met.get('gre', False):
            recommendations.append("Retake GRE to improve scores")
        
        if not requirements_met.get('research_experience', False):
            recommendations.append("Gain research experience through internships or projects")
        
        if not requirements_met.get('language_test', False):
            recommendations.append("Improve language test scores (TOEFL/IELTS)")
        
        return recommendations
    
    def _generate_overall_assessment(self, profile: AcademicProfile, predictions: List[UniversityPrediction]) -> str:
        """Generate overall assessment of admission chances"""
        avg_probability = sum(p.admission_probability for p in predictions) / len(predictions)
        
        if avg_probability >= 0.7:
            return "Strong profile with excellent admission chances across top universities"
        elif avg_probability >= 0.5:
            return "Competitive profile with good chances at most target universities"
        elif avg_probability >= 0.3:
            return "Moderate profile that may need strengthening for top-tier universities"
        else:
            return "Profile needs significant improvement to meet admission requirements"
    
    def _generate_recommendations(self, profile: AcademicProfile, predictions: List[UniversityPrediction]) -> List[str]:
        """Generate overall recommendations for improving profile"""
        recommendations = []
        
        # Analyze common weaknesses
        low_gpa_count = sum(1 for p in predictions if not p.requirements_met.get('gpa', False))
        low_gre_count = sum(1 for p in predictions if not p.requirements_met.get('gre', False))
        
        if low_gpa_count > len(predictions) * 0.5:
            recommendations.append("Focus on improving academic performance and GPA")
        
        if low_gre_count > len(predictions) * 0.5:
            recommendations.append("Invest time in GRE preparation and retake if necessary")
        
        if not profile.research_experience:
            recommendations.append("Gain research experience to strengthen your academic profile")
        
        if profile.publications == 0:
            recommendations.append("Consider publishing research work or conference papers")
        
        return recommendations
    
    def _load_university_data(self) -> List[Dict[str, Any]]:
        """Load university database (mock data for demonstration)"""
        return [
            {
                "name": "MIT",
                "ranking": 1,
                "min_gpa": 3.7,
                "min_gre_total": 320,
                "min_toefl": 100,
                "min_ielts": 7.0,
                "programs": ["computer science", "electrical engineering", "mechanical engineering"],
                "acceptance_rate": 0.07
            },
            {
                "name": "Stanford University",
                "ranking": 2,
                "min_gpa": 3.8,
                "min_gre_total": 325,
                "min_toefl": 105,
                "min_ielts": 7.5,
                "programs": ["computer science", "data science", "business"],
                "acceptance_rate": 0.04
            },
            {
                "name": "Carnegie Mellon University",
                "ranking": 3,
                "min_gpa": 3.6,
                "min_gre_total": 315,
                "min_toefl": 95,
                "min_ielts": 6.5,
                "programs": ["computer science", "robotics", "human-computer interaction"],
                "acceptance_rate": 0.15
            },
            {
                "name": "University of California, Berkeley",
                "ranking": 4,
                "min_gpa": 3.5,
                "min_gre_total": 310,
                "min_toefl": 90,
                "min_ielts": 6.5,
                "programs": ["computer science", "data science", "engineering"],
                "acceptance_rate": 0.17
            },
            {
                "name": "Georgia Institute of Technology",
                "ranking": 8,
                "min_gpa": 3.3,
                "min_gre_total": 305,
                "min_toefl": 85,
                "min_ielts": 6.0,
                "programs": ["computer science", "cybersecurity", "machine learning"],
                "acceptance_rate": 0.25
            }
        ]
    
    def _generate_cache_key(self, profile: AcademicProfile) -> str:
        """Generate cache key for profile"""
        key_components = [
            str(profile.gpa),
            str(profile.gre_verbal or 0),
            str(profile.gre_quantitative or 0),
            str(profile.research_experience),
            str(profile.publications),
            str(profile.work_experience_years)
        ]
        return "_".join(key_components)
    
    def _cache_result(self, cache_key: str, result: Dict[str, Any]):
        """Cache prediction result"""
        if len(self.cache) >= self.cache_size:
            # Remove oldest entry
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        
        self.cache[cache_key] = result
    
    def get_health(self) -> Dict[str, Any]:
        """Get service health status"""
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "service": "prediction_service",
            "dependencies": {
                "university_database": "loaded",
                "ml_models": "mock_active"
            },
            "stats": {
                "universities_loaded": len(self.university_data),
                "cache_size": len(self.cache),
                "total_requests": self.request_count
            }
        }