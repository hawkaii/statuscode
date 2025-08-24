#!/usr/bin/env python3
"""
Post-deployment validation script for Railway
Tests all endpoints to ensure the server is working correctly
"""

import requests
import json
import sys
from urllib.parse import urljoin

def test_railway_deployment(base_url):
    """Test Railway deployment endpoints"""
    
    print(f"🚀 Testing UniCompass deployment at: {base_url}")
    print("=" * 60)
    
    # Test endpoints
    endpoints = [
        {"path": "/", "method": "GET", "name": "Home"},
        {"path": "/health", "method": "GET", "name": "Health Check"},
        {"path": "/api/resume/health", "method": "GET", "name": "Resume Service Health"},
        {"path": "/api/prediction/health", "method": "GET", "name": "Prediction Service Health"},
        {"path": "/api/academic/health", "method": "GET", "name": "Academic API Health"},
        {"path": "/api/sop/health", "method": "GET", "name": "SOP Service Health"},
    ]
    
    passed = 0
    total = len(endpoints)
    
    for endpoint in endpoints:
        try:
            url = urljoin(base_url, endpoint["path"])
            
            if endpoint["method"] == "GET":
                response = requests.get(url, timeout=30)
            else:
                response = requests.post(url, json={}, timeout=30)
            
            if response.status_code == 200:
                print(f"✅ {endpoint['name']}: {response.status_code}")
                passed += 1
                
                # Show service status for health checks
                if 'health' in endpoint['path'].lower():
                    try:
                        data = response.json()
                        status = data.get('status', 'unknown')
                        print(f"   Status: {status}")
                    except:
                        pass
                        
            else:
                print(f"❌ {endpoint['name']}: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint['name']}: Connection error - {str(e)}")
        except Exception as e:
            print(f"❌ {endpoint['name']}: Error - {str(e)}")
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} endpoints working")
    
    if passed == total:
        print("🎉 All endpoints are working! Deployment successful.")
        print("\n📝 Next steps:")
        print("1. Test with actual data using POST endpoints")
        print("2. Monitor logs in Railway dashboard")
        print("3. Set up custom domain if needed")
        return True
    else:
        print("⚠️  Some endpoints failed. Check Railway logs for details.")
        print("\n🔍 Troubleshooting:")
        print("1. Verify all environment variables are set in Railway")
        print("2. Check deployment logs for errors")
        print("3. Ensure API keys are valid and have sufficient credits")
        return False

def test_sample_requests(base_url):
    """Test sample API requests with mock data"""
    
    print(f"\n🧪 Testing API endpoints with sample data...")
    print("=" * 60)
    
    # Test resume analysis (without file upload)
    try:
        url = urljoin(base_url, "/api/resume/analyze_resume")
        sample_data = {
            "text": "John Doe\nSoftware Engineer\nExperience: Python, Flask, Machine Learning\nEducation: BS Computer Science",
            "options": {"include_ai_insights": False}  # Disable AI to avoid API key requirements
        }
        
        response = requests.post(url, json=sample_data, timeout=30)
        if response.status_code == 200:
            print("✅ Resume Analysis API: Working")
            data = response.json()
            if 'ats_score' in data:
                score = data['ats_score']['total_score']
                print(f"   Sample ATS Score: {score}/100")
        else:
            print(f"❌ Resume Analysis API: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Resume Analysis API: {str(e)}")
    
    # Test university prediction
    try:
        url = urljoin(base_url, "/api/prediction/predict_universities")
        sample_data = {
            "gpa": 3.5,
            "gre_verbal": 160,
            "gre_quantitative": 165,
            "research_experience": True,
            "target_program": "computer science"
        }
        
        response = requests.post(url, json=sample_data, timeout=30)
        if response.status_code == 200:
            print("✅ University Prediction API: Working")
            data = response.json()
            if 'predictions' in data:
                count = len(data['predictions'])
                print(f"   Predictions generated: {count} universities")
        else:
            print(f"❌ University Prediction API: {response.status_code}")
            
    except Exception as e:
        print(f"❌ University Prediction API: {str(e)}")

def main():
    """Main validation function"""
    
    if len(sys.argv) < 2:
        print("Usage: python deploy_test.py <railway-url>")
        print("Example: python deploy_test.py https://unicompass-production.up.railway.app")
        sys.exit(1)
    
    base_url = sys.argv[1].rstrip('/')
    
    # Basic endpoint tests
    success = test_railway_deployment(base_url)
    
    # Sample API tests
    if success:
        test_sample_requests(base_url)
    
    print(f"\n🌐 Your UniCompass API is deployed at: {base_url}")
    print("📚 API Documentation: See README.md for endpoint details")

if __name__ == '__main__':
    main()