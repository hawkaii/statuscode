#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ml_prediction_service import MLPredictionService
from models.data_models import AcademicProfile

def test_ml_prediction():
    """Test the ML prediction service"""
    print("Testing ML Prediction Service...")
    
    try:
        # Initialize ML service
        ml_service = MLPredictionService()
        print(f"✓ ML service loaded successfully")
        print(f"✓ Model loaded: {ml_service.is_model_loaded()}")
        print(f"✓ Universities supported: {len(ml_service.get_supported_universities())}")
        
        # Create test profile
        test_profile = AcademicProfile(
            gpa=3.7,
            gre_verbal=160,
            gre_quantitative=165,
            toefl_score=110,
            research_experience=True,
            publications=2,
            work_experience_years=1.5,
            major="Computer Science",
            target_program="MS Computer Science"
        )
        
        print(f"\nTest profile: GPA={test_profile.gpa}, GRE={test_profile.gre_verbal + test_profile.gre_quantitative}, TOEFL={test_profile.toefl_score}")
        
        # Get predictions
        predictions = ml_service.predict_universities(test_profile)
        print(f"✓ Generated {len(predictions)} predictions")
        
        # Show top 10 predictions
        print(f"\nTop 10 University Predictions:")
        print(f"{'Rank':<4} {'University':<40} {'Probability':<12} {'Reasoning'}")
        print("-" * 100)
        
        for i, pred in enumerate(predictions[:10]):
            print(f"{i+1:<4} {pred.university_name:<40} {pred.admission_probability:.3f}        {pred.reasoning[:50]}...")
        
        print(f"\n✓ ML prediction service working correctly!")
        return True
        
    except Exception as e:
        print(f"✗ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_ml_prediction()
    sys.exit(0 if success else 1)