#!/usr/bin/env python3

import requests
import json

def test_prediction_endpoint():
    """Test the prediction endpoint with the provided data"""
    
    # Convert the raw model input to AcademicProfile format
    raw_data = {
        "researchExp": 5,
        "industryExp": 1,
        "toeflScore": 120.0,
        "gmatA": 6.0,
        "cgpa": 7.0,
        "gmatQ": 45.0,
        "cgpaScale": 10,
        "gmatV": 39.0,
        "gre_total": 317.0,
        "researchPubs": 10,
        "univName":"None"
    }
    
    # Convert to AcademicProfile format expected by our API
    academic_profile = {
        "gpa": raw_data["cgpa"] / raw_data["cgpaScale"] * 4.0,  # Convert to 4.0 scale
        "gre_verbal": 160,  # Estimate from total
        "gre_quantitative": 157,  # Estimate from total (317 total)
        "toefl_score": int(raw_data["toeflScore"]),
        "research_experience": raw_data["researchExp"] > 0,
        "publications": raw_data["researchPubs"],
        "work_experience_years": raw_data["industryExp"] / 12.0,  # Convert months to years
        "major": "Computer Science",
        "target_program": "MS Computer Science"
    }
    
    print("Testing University Prediction Endpoint")
    print("=" * 50)
    
    print(f"\nRaw Input Data:")
    print(json.dumps(raw_data, indent=2))
    
    print(f"\nConverted Academic Profile:")
    print(json.dumps(academic_profile, indent=2))
    
    # Test endpoints
    base_url = "http://localhost:5000"
    endpoints_to_test = [
        {
            "name": "Main Prediction Service",
            "url": f"{base_url}/api/prediction/predict_universities",
            "data": academic_profile
        },
        {
            "name": "Academic API Service", 
            "url": f"{base_url}/api/academic/predict",
            "data": raw_data  # This service might accept raw format
        }
    ]
    
    for endpoint in endpoints_to_test:
        print(f"\n{'='*60}")
        print(f"Testing: {endpoint['name']}")
        print(f"URL: {endpoint['url']}")
        print(f"{'='*60}")
        
        try:
            response = requests.post(
                endpoint['url'],
                json=endpoint['data'],
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✓ Success!")
                
                # Show key results
                if 'predictions' in result:
                    predictions = result['predictions']
                    print(f"\nTop 10 University Predictions:")
                    print(f"{'Rank':<4} {'University':<40} {'Probability':<12}")
                    print("-" * 60)
                    
                    for i, pred in enumerate(predictions[:10]):
                        univ_name = pred.get('university_name', 'Unknown')
                        prob = pred.get('admission_probability', 0)
                        print(f"{i+1:<4} {univ_name:<40} {prob:.3f}")
                
                elif isinstance(result, list):
                    print(f"\nTop 10 Results:")
                    print(f"{'Rank':<4} {'University':<40} {'Probability':<12}")
                    print("-" * 60)
                    
                    for i, pred in enumerate(result[:10]):
                        univ_name = pred.get('univName', 'Unknown')
                        prob = pred.get('p_admit', 0)
                        print(f"{i+1:<4} {univ_name:<40} {prob:.3f}")
                
                else:
                    print(f"\nResponse preview:")
                    print(json.dumps(result, indent=2)[:500] + "..." if len(str(result)) > 500 else json.dumps(result, indent=2))
            
            else:
                print(f"✗ Failed with status {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print(f"✗ Connection failed - Server not running on {base_url}")
        except requests.exceptions.Timeout:
            print(f"✗ Request timeout")
        except Exception as e:
            print(f"✗ Error: {str(e)}")

def show_curl_examples():
    """Show curl command examples"""
    
    print(f"\n{'='*60}")
    print("CURL Examples:")
    print(f"{'='*60}")
    
    # Academic Profile format
    academic_profile = {
        "gpa": 2.8,  # 7.0/10 * 4.0
        "gre_verbal": 160,
        "gre_quantitative": 157, 
        "toefl_score": 120,
        "research_experience": True,
        "publications": 10,
        "work_experience_years": 0.08,  # 1 month
        "major": "Computer Science",
        "target_program": "MS Computer Science"
    }
    
    # Raw format
    raw_data = {
        "researchExp": 5,
        "industryExp": 1,
        "toeflScore": 120.0,
        "gmatA": 6.0,
        "cgpa": 7.0,
        "gmatQ": 45.0,
        "cgpaScale": 10,
        "gmatV": 39.0,
        "gre_total": 317.0,
        "researchPubs": 10,
        "univName":"None"
    }
    
    print(f"\n1. Main Prediction Service:")
    print(f"curl -X POST http://localhost:5000/api/prediction/predict_universities \\")
    print(f"  -H 'Content-Type: application/json' \\")
    print(f"  -d '{json.dumps(academic_profile)}'")
    
    print(f"\n2. Academic API Service:")
    print(f"curl -X POST http://localhost:5000/api/academic/predict \\")
    print(f"  -H 'Content-Type: application/json' \\")
    print(f"  -d '{json.dumps(raw_data)}'")
    
    print(f"\n3. Health Check:")
    print(f"curl http://localhost:5000/health")

if __name__ == "__main__":
    print("UniCompass ML Prediction Endpoint Test")
    print("Please start the server first: python app.py")
    print("\nPress Enter to test endpoints or 'curl' for curl examples...")
    
    user_input = input().strip().lower()
    
    if user_input == 'curl':
        show_curl_examples()
    else:
        test_prediction_endpoint()
        show_curl_examples()