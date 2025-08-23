
from flask import Flask, request, jsonify

app = Flask(__name__)

# Predefined lists of universities by tier
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

@app.route('/predict_universities', methods=['POST'])
def predict_universities():
    """
    Predicts universities based on a simple rule-based system.
    """
    try:
        data = request.get_json()
        gre = data.get('gre')
        toefl = data.get('toefl')
        gpa = data.get('gpa')

        if not all([gre, toefl, gpa]):
            return jsonify({"error": "Missing required fields (gre, toefl, gpa)"}), 400

        # --- Hackathon Logic ---
        # Convert to appropriate types for comparison
        try:
            gre_score = int(gre)
            toefl_score = int(toefl)
            gpa_score = float(gpa)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid data types for scores."}), 400

        universities = []
        # Simple rule-based system based on the plan
        if gre_score >= 320 and gpa_score >= 3.7 and toefl_score >= 105:
            universities = TOP_TIER
        elif gre_score >= 310 and gpa_score >= 3.5 and toefl_score >= 95:
            universities = MID_TIER
        else:
            universities = LOWER_TIER

        # Final response based on the API contract
        response = {
            "universities": universities
        }

        print(f"Predicted universities for scores: GRE {gre_score}, GPA {gpa_score}. Returning {len(universities)} results.")

        return jsonify(response)

    except Exception as e:
        print(f"Error in PredictionAgent: {e}")
        return jsonify({"error": "An internal server error occurred in the Prediction Agent."}), 500

if __name__ == '__main__':
    # The plan specifies port 5002 for the PredictionAgent
    app.run(host='0.0.0.0', port=5002, debug=True)
