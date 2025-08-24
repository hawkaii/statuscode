#!/usr/bin/env python3
"""
Test script to validate the unified Flask server structure
"""

import sys
import os

def test_imports():
    """Test if all modules can be imported"""
    print("Testing module imports...")
    
    try:
        from models.data_models import ParsedResume, ATSScore, PredictionResult
        print("✅ Data models imported successfully")
    except ImportError as e:
        print(f"❌ Data models import failed: {e}")
        return False
    
    try:
        from utils.config import Config
        print("✅ Config utility imported successfully")
    except ImportError as e:
        print(f"❌ Config utility import failed: {e}")
        return False
    
    try:
        from utils.logger import setup_logging
        print("✅ Logger utility imported successfully")
    except ImportError as e:
        print(f"❌ Logger utility import failed: {e}")
        return False
    
    return True

def test_structure():
    """Test if all required files exist"""
    print("\nTesting file structure...")
    
    required_files = [
        'app.py',
        'models/data_models.py',
        'services/resume_service.py',
        'services/prediction_service.py',
        'services/sop_service.py',
        'services/academic_api_service.py',
        'utils/config.py',
        'utils/logger.py',
        'requirements.txt',
        'README.md',
        '.env.example'
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            all_exist = False
    
    return all_exist

def test_config():
    """Test configuration loading"""
    print("\nTesting configuration...")
    
    try:
        from utils.config import Config
        config = Config()
        print("✅ Configuration object created")
        
        # Test config attributes
        assert hasattr(config, 'DEBUG'), "DEBUG attribute missing"
        assert hasattr(config, 'GROQ_API_KEY'), "GROQ_API_KEY attribute missing"
        assert hasattr(config, 'SCORING_WEIGHTS'), "SCORING_WEIGHTS attribute missing"
        
        print("✅ Configuration attributes validated")
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def test_endpoints_structure():
    """Test that main endpoint functions are defined"""
    print("\nTesting Flask app structure (without running server)...")
    
    try:
        # Read app.py and check for endpoint definitions
        with open('app.py', 'r') as f:
            app_content = f.read()
        
        required_endpoints = [
            '@app.route(\'/\'',
            '@app.route(\'/health\'',
            '@app.route(\'/api/resume/analyze_resume\'',
            '@app.route(\'/api/prediction/predict_universities\'',
            '@app.route(\'/api/sop/analyze\'',
            '@app.route(\'/api/academic/predict\'',
            '@app.route(\'/api/analyze\''
        ]
        
        all_found = True
        for endpoint in required_endpoints:
            if endpoint in app_content:
                print(f"✅ {endpoint}")
            else:
                print(f"❌ {endpoint} - NOT FOUND")
                all_found = False
        
        return all_found
        
    except Exception as e:
        print(f"❌ Endpoint structure test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 UniCompass Unified Flask Server Structure Test")
    print("=" * 50)
    
    tests = [
        test_structure,
        test_imports,
        test_config,
        test_endpoints_structure
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()  # Add spacing between tests
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The unified Flask server structure is valid.")
        print("📝 Next steps:")
        print("   1. Set up environment variables in .env file")
        print("   2. Install required packages: pip install -r requirements.txt")
        print("   3. Run the server: python app.py")
    else:
        print("⚠️  Some tests failed. Please review and fix the issues above.")
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)