import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score
import pickle

try:
    df = pd.read_csv("output.csv")
except NameError:
    # Replace with your actual path
    df = pd.read_csv("admissions.csv")

df = df.copy()

# Ensure correct dtypes (your printout suggests these are already clean)
cat_col = "univName"
target = "admit"

# Optional: filter to universities with enough samples to learn something reliable
min_univ_count = 25
univ_counts = df[cat_col].value_counts()
keep_univs = univ_counts[univ_counts >= min_univ_count].index
df = df[df[cat_col].isin(keep_univs)].reset_index(drop=True)

# Features: all columns except target and university name
feature_cols = [
    c for c in df.columns
    if c not in {target, cat_col}
]

numeric_cols = [c for c in feature_cols if np.issubdtype(df[c].dtype, np.number)]
# (no extra categoricals in your schema, but you could add them here if present)

X = df[numeric_cols + [cat_col]]
y = df[target].astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

num_tf = Pipeline(steps=[
    ("scaler", StandardScaler())
])

cat_tf = OneHotEncoder(handle_unknown="ignore")

preprocess = ColumnTransformer(
    transformers=[
        ("num", num_tf, numeric_cols),
        ("cat", cat_tf, [cat_col])
    ]
)

# Base classifier
base_clf = LogisticRegression(
    max_iter=2000,
    penalty="l2",
    C=1.0,
    solver="lbfgs"
)

# Calibrate probabilities (Platt scaling)
clf = Pipeline(steps=[
    ("prep", preprocess),
    ("cal", CalibratedClassifierCV(estimator=base_clf, method="sigmoid", cv=5))
])

clf.fit(X_train, y_train)

# Persist the trained pipeline to a pickle file for later loading by the API
with open("academic_model.pkl", "wb") as f:
    pickle.dump(clf, f)

print("Saved trained model to academic_model.pkl")
