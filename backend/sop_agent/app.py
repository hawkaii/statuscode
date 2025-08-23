import os
from flask import Flask, request, jsonify
from datetime import datetime
import uuid
# from google.generativeai import Gemini (stubbed for demo)

app = Flask(__name__)
from flask_cors import CORS
CORS(app, origins=["http://localhost:3000"])

# In-memory storage for demo
USER_HISTORY = {}
EXAMPLES = [
    {
        "title": "Leadership Example",
        "text": "During my undergraduate studies, I led a team of five in developing a mobile app for campus safety..."
    },
    {
        "title": "Research Example",
        "text": "My passion for research was ignited when I joined the AI lab and contributed to a published paper on NLP..."
    }
]

# Stub Gemini API call

def gemini_review_sop(draft):
    # Replace with actual Gemini API call
    # Prompt: "Review this SOP draft. Give actionable feedback, specific cues, and suggest improvements. Do not rewrite the essay, only annotate and guide."
    return {
        "feedback": [
            "Clarify your motivation for choosing this program.",
            "Add more details about your leadership experience.",
            "Be specific about your future goals."
        ],
        "cues": [
            "What inspired you to pursue this field?",
            "Describe a challenge you overcame.",
            "How will this program help you achieve your ambitions?"
        ]
    }

@app.route('/review', methods=['POST'])
def review():
    data = request.json
    user_id = data.get('user_id')
    draft = data.get('draft')
    if not user_id or not draft:
        return jsonify({"error": "Missing user_id or draft"}), 400
    feedback = gemini_review_sop(draft)
    entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "draft": draft,
        "feedback": feedback["feedback"],
        "cues": feedback["cues"]
    }
    USER_HISTORY.setdefault(user_id, []).append(entry)
    return jsonify(entry)

@app.route('/suggest', methods=['PATCH'])
def suggest():
    data = request.json
    user_id = data.get('user_id')
    revision = data.get('revision')
    if not user_id or not revision:
        return jsonify({"error": "Missing user_id or revision"}), 400
    feedback = gemini_review_sop(revision)
    entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "draft": revision,
        "feedback": feedback["feedback"],
        "cues": feedback["cues"]
    }
    USER_HISTORY.setdefault(user_id, []).append(entry)
    return jsonify(entry)

@app.route('/examples', methods=['GET'])
def examples():
    return jsonify(EXAMPLES)

@app.route('/history', methods=['GET'])
def history():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    return jsonify(USER_HISTORY.get(user_id, []))

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(port=5003, debug=True)
