import os
import requests
from flask import Flask, render_template, request, jsonify
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

# --- Agent Endpoints (hardcoded for local development) ---
PREDICTION_AGENT_URL = "http://localhost:5002/predict_universities"
RESUME_AGENT_URL = "http://localhost:5001/analyze_resume"

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
    Mocked response for now. Will call ResumeAgent in integration phase.
    """
    data = request.get_json()
    return jsonify({
        "ats_score": 92,
        "feedback": [
            "Add more action verbs.",
            "Highlight leadership experience."
        ]
    })

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
