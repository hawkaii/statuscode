import logging
import time
from typing import Dict, List, Any, Tuple
from functools import lru_cache

logger = logging.getLogger(__name__)

# University data
TOP_TIER = [
    "Massachusetts Institute of Technology (MIT)",
    "Stanford University", 
    "Carnegie Mellon University",
    "University of California, Berkeley"
]

MID_TIER = [
    "University of Illinois Urbana-Champaign",
    "Georgia Institute of Technology",
    "University of Michigan",
    "University of Texas at Austin",
    "Purdue University"
]

LOWER_TIER = [
    "Arizona State University",
    "University of Florida",
    "Texas A&M University",
    "Ohio State University"
]

class PredictionService:
    def __init__(self, cache_size: int = 256):
        self.cache_size = cache_size
        logger.info(f"Prediction service initialized with cache size: {cache_size}")
    
    def validate_input_data(self, data: Dict) -> Tuple[bool, str]:
        """
        Validates input data for university prediction.
        
        Returns:
            Tuple[bool, str]: (is_valid, error_message)
        """
        if not data:
            return False, "Request body must be valid JSON"
        
        required_fields = ['gre', 'toefl', 'gpa']
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]
        
        if missing_fields:
            return False, f"Missing required fields: {', '.join(missing_fields)}"
        
        try:
            gre_score = int(data['gre'])
            toefl_score = int(data['toefl']) 
            gpa_score = float(data['gpa'])
            
            # Validate score ranges
            if not (260 <= gre_score <= 340):
                return False, "GRE score must be between 260 and 340"
            if not (0 <= toefl_score <= 120):
                return False, "TOEFL score must be between 0 and 120"
            if not (0.0 <= gpa_score <= 4.0):
                return False, "GPA must be between 0.0 and 4.0"
                
            return True, ""
            
        except (ValueError, TypeError) as e:
            return False, f"Invalid data types for scores: {str(e)}"

    @lru_cache(maxsize=256)
    def predict_university_tier(self, gre: int, toefl: int, gpa: float) -> Tuple[List[str], str]:
        """
        Predicts university tier based on academic scores.
        Uses LRU cache for performance optimization.
        
        Args:
            gre: GRE score (260-340)
            toefl: TOEFL score (0-120)
            gpa: GPA (0.0-4.0)
            
        Returns:
            Tuple of (universities list, tier name)
        """
        if gre >= 320 and gpa >= 3.7 and toefl >= 105:
            return TOP_TIER, "top"
        elif gre >= 310 and gpa >= 3.5 and toefl >= 95:
            return MID_TIER, "mid"
        else:
            return LOWER_TIER, "lower"

    def predict_universities(self, data: Dict) -> Dict[str, Any]:
        """
        Main prediction method
        
        Args:
            data: Dictionary containing gre, toefl, gpa scores
            
        Returns:
            Dictionary with universities and metadata
        """
        request_start_time = time.time()
        request_id = f"req_{int(request_start_time * 1000)}"
        
        logger.info(f"[{request_id}] Processing university prediction request")
        
        # Validate input data
        is_valid, error_message = self.validate_input_data(data)
        if not is_valid:
            logger.warning(f"[{request_id}] Validation error: {error_message}")
            raise ValueError(error_message)
        
        # Extract and convert scores
        gre_score = int(data['gre'])
        toefl_score = int(data['toefl'])
        gpa_score = float(data['gpa'])
        
        # Predict universities (cached for performance)
        universities, tier = self.predict_university_tier(gre_score, toefl_score, gpa_score)
        
        processing_time = (time.time() - request_start_time) * 1000
        
        response = {
            "universities": universities,
            "metadata": {
                "tier": tier,
                "request_id": request_id,
                "timestamp": time.time(),
                "processing_time_ms": round(processing_time, 2)
            }
        }
        
        logger.info(f"[{request_id}] Successfully predicted {len(universities)} universities in {tier} tier ({processing_time:.2f}ms)")
        return response

    def get_cache_info(self) -> Dict[str, Any]:
        """Get cache statistics"""
        cache_stats = self.predict_university_tier.cache_info()
        return {
            "cache_info": {
                "hits": cache_stats.hits,
                "misses": cache_stats.misses,
                "maxsize": cache_stats.maxsize,
                "currsize": cache_stats.currsize,
                "hit_rate": cache_stats.hits / (cache_stats.hits + cache_stats.misses) if (cache_stats.hits + cache_stats.misses) > 0 else 0
            },
            "timestamp": time.time()
        }

    def clear_cache(self) -> Dict[str, Any]:
        """Clear the prediction cache"""
        self.predict_university_tier.cache_clear()
        logger.info("Prediction cache cleared")
        return {
            "message": "Cache cleared successfully",
            "timestamp": time.time()
        }

# Global instance
prediction_service = PredictionService()