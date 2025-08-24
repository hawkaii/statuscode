from typing import Dict, List, Optional, Any
import logging
import pandas as pd
import pickle
import os
from pathlib import Path

from models.data_models import AcademicProfile, UniversityPrediction

logger = logging.getLogger('unicompass.ml_prediction_service')

class MLPredictionService:
    """Real ML-based university admission prediction service"""
    
    def __init__(self):
        self.model = None
        self.university_list = []
        self.min_univ_count = 25
        self._load_model_and_data()
        
    def _load_model_and_data(self):
        """Load the trained ML model and university data"""
        try:
            # Get the directory where this file is located
            current_dir = Path(__file__).parent
            model_path = current_dir / "academic_model.pkl"
            data_path = current_dir / "output.csv"
            
            # Load the trained model
            with open(model_path, "rb") as f:
                self.model = pickle.load(f)
            
            # Load training data to get university list
            df = pd.read_csv(data_path)
            univ_counts = df["univName"].value_counts()
            self.university_list = sorted(univ_counts[univ_counts >= self.min_univ_count].index)
            
            logger.info(f"Loaded ML model with {len(self.university_list)} universities")
            
        except Exception as e:
            logger.error(f"Failed to load ML model: {str(e)}")
            raise Exception(f"ML model loading failed: {str(e)}")
    
    def predict_universities(self, profile: AcademicProfile) -> List[UniversityPrediction]:
        """Generate university predictions using the trained ML model"""
        try:
            if self.model is None:
                raise Exception("ML model not loaded")
            
            # Map AcademicProfile to the format expected by the model
            applicant_data = self._profile_to_model_input(profile)
            
            # Create DataFrame for all universities
            X_cand = pd.DataFrame([applicant_data] * len(self.university_list))
            X_cand["univName"] = self.university_list
            
            # Get predictions from the model
            probs = self.model.predict_proba(X_cand)[:, 1]
            
            # Convert to UniversityPrediction objects
            predictions = []
            for i, univ_name in enumerate(self.university_list):
                prediction = UniversityPrediction(
                    university_name=univ_name,
                    program=profile.target_program,
                    admission_probability=float(probs[i]),
                    tier="",  # Will be set by categorization
                    reasoning=self._generate_ml_reasoning(profile, univ_name, probs[i]),
                    requirements_met={},  # Could be enhanced with requirement checking
                    recommendations=[]    # Could be enhanced with ML-based recommendations
                )
                predictions.append(prediction)
            
            # Sort by admission probability
            predictions.sort(key=lambda x: x.admission_probability, reverse=True)
            
            return predictions
            
        except Exception as e:
            logger.error(f"ML prediction failed: {str(e)}")
            raise Exception(f"ML prediction failed: {str(e)}")
    
    def _profile_to_model_input(self, profile: AcademicProfile) -> Dict[str, Any]:
        """Convert AcademicProfile to model input format based on training data columns"""
        
        # Calculate total GRE score
        gre_total = 0
        if profile.gre_verbal and profile.gre_quantitative:
            gre_total = profile.gre_verbal + profile.gre_quantitative
        
        # Map to the columns used in the training data
        # Based on CSV columns: researchExp, industryExp, toeflScore, gmatA, cgpa, gmatQ, cgpaScale, gmatV, gre_total, researchPubs
        model_input = {
            "researchExp": 1 if profile.research_experience else 0,
            "industryExp": int(profile.work_experience_years * 12),  # Convert years to months
            "toeflScore": float(profile.toefl_score) if profile.toefl_score else 100.0,
            "gmatA": 4.5,  # Default GMAT Analytical (not in our profile)
            "cgpa": profile.gpa,
            "gmatQ": 49.0,  # Default GMAT Quantitative (not in our profile) 
            "cgpaScale": 10.0,  # Assuming 10-point scale
            "gmatV": 31.5,  # Default GMAT Verbal (not in our profile)
            "gre_total": float(gre_total),
            "researchPubs": profile.publications
        }
        
        return model_input
    
    def _generate_ml_reasoning(self, profile: AcademicProfile, university: str, probability: float) -> str:
        """Generate reasoning for ML-based prediction"""
        reasons = []
        
        if probability >= 0.7:
            reasons.append(f"Strong profile match for {university}")
        elif probability >= 0.4:
            reasons.append(f"Competitive profile for {university}")
        else:
            reasons.append(f"Below-average match for {university}")
        
        if profile.gpa >= 3.5:
            reasons.append("Strong GPA")
        elif profile.gpa >= 3.0:
            reasons.append("Acceptable GPA")
        else:
            reasons.append("GPA needs improvement")
        
        if profile.gre_verbal and profile.gre_quantitative:
            total_gre = profile.gre_verbal + profile.gre_quantitative
            if total_gre >= 320:
                reasons.append("Excellent GRE scores")
            elif total_gre >= 300:
                reasons.append("Good GRE scores")
            else:
                reasons.append("GRE scores need improvement")
        
        if profile.research_experience:
            reasons.append("Research experience adds value")
        
        if profile.publications > 0:
            reasons.append(f"{profile.publications} publications strengthen profile")
        
        return "; ".join(reasons)
    
    def get_supported_universities(self) -> List[str]:
        """Get list of universities supported by the model"""
        return self.university_list.copy()
    
    def is_model_loaded(self) -> bool:
        """Check if ML model is properly loaded"""
        return self.model is not None and len(self.university_list) > 0