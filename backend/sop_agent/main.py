import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from flask import Flask, request, jsonify
from datetime import datetime
from gemini_client import GeminiClient
from storage import Storage
from auth import token_required
from config import Config
from embeddings import get_embedding, get_embedding_service
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
from flask_cors import CORS
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])
gemini = GeminiClient(api_key=Config.GEMINI_API_KEY)
storage = Storage()

# Initialize embedding service on startup
embedding_service = get_embedding_service()
logger.info(f"Embedding service initialized with dimension: {embedding_service.get_embedding_dimension()}")

# Initialize database
from models import init_db
init_db()

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



@app.route('/api/review', methods=['POST', 'OPTIONS'])
@token_required
def review():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    data = request.json
    user_id = data.get('user_id')
    draft = data.get('draft')
    if not user_id or not draft:
        return jsonify({"error": "Missing user_id or draft"}), 400

    # Generate embedding for the draft
    logger.info("Generating embedding for SOP draft")
    draft_embedding = get_embedding(draft)

    # Get similar examples and feedback for RAG context
    logger.info("Retrieving similar examples and feedback for RAG context")
    similar_examples = storage.get_similar_examples(draft, get_embedding)
    similar_feedback = storage.get_similar_feedback(draft, get_embedding)

    logger.info(f"Found {len(similar_examples)} similar examples and {len(similar_feedback)} similar feedback patterns")

    # Build context for Gemini
    context = {
        "similar_examples": similar_examples,
        "similar_feedback": similar_feedback
    }

    # Get enhanced feedback using RAG
    feedback = gemini.review_sop_with_context(draft, context)

    # Save history
    entry = storage.save_history(user_id, draft, feedback["feedback"], feedback["cues"])

    # Save embedding for future searches
    storage.save_embedding(draft, 'draft', draft_embedding)

    return jsonify({
        "id": entry.id,
        "timestamp": entry.timestamp.isoformat(),
        "draft": entry.draft,
        "feedback": entry.feedback.split('\n'),
        "cues": entry.cues.split('\n'),
        "context_used": len(similar_examples) + len(similar_feedback)
    })

@app.route('/api/suggest', methods=['PATCH', 'OPTIONS'])
@token_required
def suggest():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    data = request.json
    user_id = data.get('user_id')
    revision = data.get('revision')
    if not user_id or not revision:
        return jsonify({"error": "Missing user_id or revision"}), 400
    feedback = gemini.review_sop(revision)
    entry = storage.save_history(user_id, revision, feedback["feedback"], feedback["cues"])
    return jsonify({
        "id": entry.id,
        "timestamp": entry.timestamp.isoformat(),
        "draft": entry.draft,
        "feedback": entry.feedback.split('\n'),
        "cues": entry.cues.split('\n')
    })

@app.route('/api/examples', methods=['GET', 'OPTIONS'])
@token_required
def examples():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    return jsonify(EXAMPLES)

@app.route('/api/history', methods=['GET', 'OPTIONS'])
@token_required
def history():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    entries = storage.get_history(user_id)
    return jsonify([
        {
            "id": e.id,
            "timestamp": e.timestamp.isoformat(),
            "draft": e.draft,
            "feedback": e.feedback.split('\n'),
            "cues": e.cues.split('\n')
        } for e in entries
    ])

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=False)
