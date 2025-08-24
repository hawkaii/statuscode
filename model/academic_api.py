from flask import Flask, request, jsonify
import pandas as pd
import pickle
import pandas as pd

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
