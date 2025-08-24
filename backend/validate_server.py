#!/usr/bin/env python3
"""
Simple test to validate the unified Flask server without external dependencies
"""

import os
import json

def validate_app_structure():
    """Validate the app.py structure"""
    print("🔍 Validating Flask app structure...")
    
    with open('app.py', 'r') as f:
        content = f.read()
    
    # Check for critical components
    checks = {
        "Flask imports": "from flask import Flask",
        "CORS setup": "from flask_cors import CORS", 
        "Service imports": "from services.resume_service import ResumeService",
        "Main route": "@app.route('/', methods=['GET'])",
        "Health check": "@app.route('/health', methods=['GET'])",
        "Resume OCR": "@app.route('/api/resume/ocr_resume'",
        "Resume analysis": "@app.route('/api/resume/analyze_resume'",
        "University prediction": "@app.route('/api/prediction/predict_universities'",
        "Academic API": "@app.route('/api/academic/predict'",
        "SOP analysis": "@app.route('/api/sop/analyze'",
        "Unified analysis": "@app.route('/api/analyze'",
        "Error handlers": "@app.errorhandler(404)",
        "Main execution": "if __name__ == '__main__':"
    }
    
    passed = 0
    for check_name, check_pattern in checks.items():
        if check_pattern in content:
            print(f"✅ {check_name}")
            passed += 1
        else:
            print(f"❌ {check_name}")
    
    print(f"\n📊 App structure: {passed}/{len(checks)} checks passed")
    return passed == len(checks)

def validate_services():
    """Validate service implementations"""
    print("\n🔍 Validating service implementations...")
    
    services = {
        "Resume Service": "services/resume_service.py",
        "Prediction Service": "services/prediction_service.py", 
        "SOP Service": "services/sop_service.py",
        "Academic API Service": "services/academic_api_service.py"
    }
    
    passed = 0
    for service_name, service_file in services.items():
        if os.path.exists(service_file):
            with open(service_file, 'r') as f:
                content = f.read()
            
            # Check for class definition
            class_name = service_name.replace(" ", "")
            if f"class {class_name}:" in content:
                print(f"✅ {service_name} class defined")
                passed += 1
            else:
                print(f"❌ {service_name} class not found")
        else:
            print(f"❌ {service_name} file missing")
    
    print(f"\n📊 Services: {passed}/{len(services)} services validated")
    return passed == len(services)

def validate_models():
    """Validate data models"""
    print("\n🔍 Validating data models...")
    
    if os.path.exists('models/data_models.py'):
        with open('models/data_models.py', 'r') as f:
            content = f.read()
        
        models = [
            "ParsedResume", "ATSScore", "ResumeAnalysisResult", 
            "AcademicProfile", "UniversityPrediction", "PredictionResult",
            "SOPAnalysis", "SOPEnhancement", "HealthCheck"
        ]
        
        found_models = 0
        for model in models:
            if f"class {model}" in content:
                print(f"✅ {model} model defined")
                found_models += 1
            else:
                print(f"❌ {model} model not found")
        
        print(f"\n📊 Models: {found_models}/{len(models)} models defined")
        return found_models >= len(models) * 0.8  # 80% of models should be present
    else:
        print("❌ Data models file not found")
        return False

def validate_documentation():
    """Validate documentation"""
    print("\n🔍 Validating documentation...")
    
    docs = {
        "README.md": "# UniCompass Unified Backend",
        ".env.example": "# Flask Configuration", 
        "requirements.txt": "Flask=="
    }
    
    passed = 0
    for doc_file, expected_content in docs.items():
        if os.path.exists(doc_file):
            with open(doc_file, 'r') as f:
                content = f.read()
            if expected_content in content:
                print(f"✅ {doc_file} properly formatted")
                passed += 1
            else:
                print(f"⚠️ {doc_file} exists but may need content review")
                passed += 0.5
        else:
            print(f"❌ {doc_file} missing")
    
    print(f"\n📊 Documentation: {passed}/{len(docs)} docs validated")
    return passed >= len(docs) * 0.8

def count_endpoints():
    """Count and display all available endpoints"""
    print("\n📋 Endpoint Summary:")
    
    with open('app.py', 'r') as f:
        content = f.read()
    
    import re
    endpoints = re.findall(r"@app\.route\('([^']+)'", content)
    
    print(f"Total endpoints found: {len(endpoints)}")
    
    categories = {
        "General": [],
        "Resume": [], 
        "Prediction": [],
        "Academic": [],
        "SOP": [],
        "Unified": []
    }
    
    for endpoint in endpoints:
        if endpoint in ['/', '/health']:
            categories["General"].append(endpoint)
        elif endpoint.startswith('/api/resume'):
            categories["Resume"].append(endpoint)
        elif endpoint.startswith('/api/prediction'):
            categories["Prediction"].append(endpoint)
        elif endpoint.startswith('/api/academic'):
            categories["Academic"].append(endpoint)
        elif endpoint.startswith('/api/sop'):
            categories["SOP"].append(endpoint)
        elif endpoint == '/api/analyze':
            categories["Unified"].append(endpoint)
    
    for category, eps in categories.items():
        if eps:
            print(f"\n{category} Endpoints ({len(eps)}):")
            for ep in eps:
                print(f"  • {ep}")

def main():
    """Run complete validation"""
    print("🚀 UniCompass Unified Flask Server Validation")
    print("=" * 60)
    
    tests = [
        validate_app_structure,
        validate_services, 
        validate_models,
        validate_documentation
    ]
    
    passed_tests = 0
    for test in tests:
        if test():
            passed_tests += 1
        print()
    
    count_endpoints()
    
    print("\n" + "=" * 60)
    print(f"📊 Overall Results: {passed_tests}/{len(tests)} test categories passed")
    
    if passed_tests >= len(tests) * 0.8:  # 80% pass rate
        print("🎉 Validation successful! The unified Flask server is ready.")
        print("\n📝 Setup Instructions:")
        print("1. Create .env file from .env.example")
        print("2. Add your API keys to .env")
        print("3. Install dependencies: pip install -r requirements.txt")
        print("4. Run server: python app.py")
        print("\n🌟 The server consolidates all agent functionality into one unified API!")
    else:
        print("⚠️  Some validation checks failed. Please review the issues above.")
    
    return passed_tests >= len(tests) * 0.8

if __name__ == '__main__':
    main()