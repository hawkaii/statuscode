import os
import requests
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
# from google.generativeai import GenerativeModel

# --- FAKE GEMINI API (FOR DEMO PURPOSES) ---
# In a real scenario, you would use the actual Gemini API client.
# from google.api_key import client_secret
# genai.configure(api_key=client_secret)
class FakeGemini:
    def generate_content(self, prompt):
        # Simulate a delay
        import time
        time.sleep(2)
        return f"This is a sample Statement of Purpose generated based on the following prompt: {prompt}"

genai_model = FakeGemini()
# genai_model = GenerativeModel('gemini-pro')

# -----------------------------------------

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://*.vultr.com", "https://*.unicompass.com"])

# --- Agent Endpoints (configurable for deployment) ---
PREDICTION_AGENT_URL = os.getenv('PREDICTION_AGENT_URL', "http://localhost:5002/predict_universities")
RESUME_AGENT_URL = os.getenv('RESUME_AGENT_URL', "http://localhost:5001/analyze_resume")
SOP_AGENT_URL = os.getenv('SOP_AGENT_URL', "http://localhost:5003")

@app.route('/')
def index():
    """Renders the main user interface."""
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Mocked response for now. Will call PredictionAgent in integration phase.
    """
    data = request.get_json()
    return jsonify({
        "predictions": [
            {"name": "University of Example", "chance": "Target"},
            {"name": "Sample State University", "chance": "Reach"}
        ]
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Forwards resume analysis request to ResumeAgent and returns the result.
    """
    data = request.get_json()
    
    try:
        # Forward the request to the ResumeAgent
        response = requests.post(RESUME_AGENT_URL, json=data, timeout=30)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "Resume analysis failed",
                "details": response.text
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        # Fallback to mocked response if ResumeAgent is unavailable
        return jsonify({
            "error": "Resume agent unavailable",
            "fallback_data": {
                "ats_score": 75,
                "feedback": [
                    "Resume agent is currently unavailable.",
                    "Please try again later."
                ]
            },
            "details": str(e)
        }), 503

@app.route('/craft_sop', methods=['POST'])
def craft_sop():
    """
    Crafts a Statement of Purpose using the fake Gemini model.
    """
    data = request.get_json()
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Use the fake Gemini model to generate SOP
        sop = genai_model.generate_content(prompt)
        return jsonify({"sop": sop})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- SOP Agent Proxy Endpoints ---
@app.route('/api/review', methods=['POST', 'OPTIONS'])
def proxy_sop_review():
    """
    Proxies SOP review requests to the SOP Agent.
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Forward the request to SOP Agent
        response = requests.post(
            f"{SOP_AGENT_URL}/api/review", 
            json=request.get_json(),
            headers={'Authorization': request.headers.get('Authorization', '')},
            timeout=30
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "SOP review failed",
                "details": response.text
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "SOP agent unavailable", 
            "details": str(e)
        }), 503

@app.route('/api/suggest', methods=['PATCH', 'OPTIONS'])
def proxy_sop_suggest():
    """
    Proxies SOP suggestion requests to the SOP Agent.
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        response = requests.patch(
            f"{SOP_AGENT_URL}/api/suggest", 
            json=request.get_json(),
            headers={'Authorization': request.headers.get('Authorization', '')},
            timeout=30
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "SOP suggestion failed",
                "details": response.text
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "SOP agent unavailable", 
            "details": str(e)
        }), 503

@app.route('/api/examples', methods=['GET', 'OPTIONS'])
def proxy_sop_examples():
    """
    Proxies SOP examples requests to the SOP Agent.
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        response = requests.get(
            f"{SOP_AGENT_URL}/api/examples",
            headers={'Authorization': request.headers.get('Authorization', '')},
            timeout=10
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "Failed to get SOP examples",
                "details": response.text
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "SOP agent unavailable", 
            "details": str(e)
        }), 503

@app.route('/api/history', methods=['GET', 'OPTIONS'])
def proxy_sop_history():
    """
    Proxies SOP history requests to the SOP Agent.
    """
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Forward query parameters
        user_id = request.args.get('user_id')
        response = requests.get(
            f"{SOP_AGENT_URL}/api/history",
            params={'user_id': user_id} if user_id else {},
            headers={'Authorization': request.headers.get('Authorization', '')},
            timeout=10
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "Failed to get SOP history",
                "details": response.text
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "SOP agent unavailable", 
            "details": str(e)
        }), 503

@app.route('/api/health', methods=['GET'])
def unified_health():
    """
    Unified health check endpoint for all services.
    """
    health_status = {
        "orchestrator": "healthy",
        "timestamp": "2025-01-01T12:00:00Z"
    }
    
    # Check SOP Agent
    try:
        response = requests.get(f"{SOP_AGENT_URL}/api/health", timeout=5)
        health_status["sop_agent"] = "healthy" if response.status_code == 200 else "unhealthy"
    except:
        health_status["sop_agent"] = "unavailable"
    
    # Check Prediction Agent
    try:
        response = requests.get(f"{PREDICTION_AGENT_URL.replace('/predict_universities', '/health')}", timeout=5)
        health_status["prediction_agent"] = "healthy" if response.status_code == 200 else "unhealthy"
    except:
        health_status["prediction_agent"] = "unavailable"
    
    # Check Resume Agent
    try:
        response = requests.get(f"{RESUME_AGENT_URL.replace('/analyze_resume', '/health')}", timeout=5)
        health_status["resume_agent"] = "healthy" if response.status_code == 200 else "unhealthy"
    except:
        health_status["resume_agent"] = "unavailable"
    
    return jsonify(health_status)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
