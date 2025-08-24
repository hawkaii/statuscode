
from flask import Flask, request, jsonify
from llmresumeenhancer import enhance_resume
from llmenhancer import compute_adjusted_recommendations, _assert_univ_input
import pandas as pd
import pickle

app = Flask(__name__)

df = pd.read_csv("output.csv")
min_univ_count = 25
univ_counts = df["univName"].value_counts()
keep_univs = univ_counts[univ_counts >= min_univ_count].index

with open("academic_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    applicant = request.get_json()
    
    univs = sorted(keep_univs)
    X_cand = pd.DataFrame([applicant] * len(univs))
    X_cand["univName"] = univs

    # Get calibrated probability of admit=1 for each university (values in [0, 1])
    probs = model.predict_proba(X_cand)[:, 1]

    results = pd.DataFrame({"univName": univs, "p_admit": probs})
    # Show top 10 universities by predicted admit probability
    top10 = results.sort_values("p_admit", ascending=False).head(50).reset_index(drop=True)
    return top10.to_json(orient="records")

@app.route('/enhance_resume', methods=['POST'])
def enhance_resume_endpoint():
    try:
        data = request.get_json()
        raw_resume_api = data.get('raw_resume_api', {})
        resume_analyser_api = data.get('resume_analyser_api', {})
        result = enhance_resume(raw_resume_api, resume_analyser_api)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/adjust_recommendations', methods=['POST'])
def adjust_recommendations_endpoint():
    try:
        data = request.get_json()
        univ_payload = _assert_univ_input(data.get('university_recommendations', []))
        resume_payload = data.get('resume_analyzer', {})
        temperature = float(data.get('temperature', 0.2))
        result = compute_adjusted_recommendations(univ_payload, resume_payload, temperature=temperature)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
