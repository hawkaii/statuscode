
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/analyze_resume', methods=['POST'])
def analyze_resume():
    """
    Analyzes resume text based on simple heuristics.
    """
    try:
        data = request.get_json()
        resume_text = data.get('resume_text')

        if not resume_text:
            return jsonify({"error": "Resume text is required"}), 400

        # --- Hackathon Logic ---
        # 1. Score based on length
        score = min(100, 60 + (len(resume_text) // 50))

        feedback = []

        # 2. Score and feedback based on keywords
        keywords = ['python', 'java', 'c++', 'javascript', 'react', 'angular', 'vue', 'project management', 'agile', 'scrum', 'leadership', 'teamwork']
        found_keywords = [kw for kw in keywords if kw in resume_text.lower()]
        if found_keywords:
            score = min(100, score + len(found_keywords) * 2)
            feedback.append(f"Good inclusion of keywords: {', '.join(found_keywords[:3])}...")
        else:
            feedback.append("Consider adding relevant skills and technology keywords.")

        # 3. Score and feedback based on action verbs
        action_verbs = ['developed', 'led', 'managed', 'created', 'implemented', 'designed', 'architected', 'optimized']
        found_verbs = [verb for verb in action_verbs if verb in resume_text.lower()]
        if found_verbs:
            score = min(100, score + len(found_verbs) * 3)
            feedback.append("Excellent use of action verbs to describe your accomplishments.")
        else:
            feedback.append("Try using stronger action verbs (e.g., 'Developed', 'Managed') to start your bullet points.")

        feedback.append("Ensure your contact information is clear and up-to-date.")

        # Final response based on the API contract
        response = {
            "ats_score": score,
            "feedback": feedback
        }

        print(f"Analyzed resume (length: {len(resume_text)}). Returning score: {score}")

        return jsonify(response)

    except Exception as e:
        print(f"Error in ResumeAgent: {e}")
        return jsonify({"error": "An internal server error occurred in the Resume Agent."}), 500

if __name__ == '__main__':
    # The plan specifies port 5001 for the ResumeAgent
    app.run(host='0.0.0.0', port=5001, debug=True)
