import jwt
import requests
import os
import time

SECRET_KEY = "supersecret"  # Replace with your actual SECRET_KEY if different
USER_ID = "testuser"

# Generate JWT token
payload = {"user_id": USER_ID}
token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
headers = {
    "Authorization": f"Bearer {token}"
}
base_url = "http://localhost:5003"

# 1. Test /api/examples (GET)
resp = requests.get(f"{base_url}/api/examples", headers=headers)
print("/api/examples status:", resp.status_code)
print("/api/examples response:", resp.text)
assert resp.status_code == 200
assert "Leadership Example" in resp.text
print("/api/examples test passed!\n")

# 2. Test /api/review (POST)
with open("tests/sop_eg.txt", "r") as f:
    sop_draft = f.read()
review_payload = {
    "user_id": USER_ID,
    "draft": sop_draft
}
resp = requests.post(f"{base_url}/api/review", headers=headers, json=review_payload)
print("/api/review status:", resp.status_code)
print("/api/review response:", resp.text)
assert resp.status_code == 200
assert "feedback" in resp.text
print("/api/review test passed!\n")

# 3. Test /api/suggest (PATCH)
suggest_payload = {
    "user_id": USER_ID,
    "revision": "This is my revised SOP for testing."
}
resp = requests.patch(f"{base_url}/api/suggest", headers=headers, json=suggest_payload)
print("/api/suggest status:", resp.status_code)
print("/api/suggest response:", resp.text)
assert resp.status_code == 200
assert "feedback" in resp.text
print("/api/suggest test passed!\n")

# 4. Test /api/history (GET)
# Wait a moment to ensure history is saved
time.sleep(1)
resp = requests.get(f"{base_url}/api/history?user_id={USER_ID}", headers=headers)
print("/api/history status:", resp.status_code)
print("/api/history response:", resp.text)
assert resp.status_code == 200
assert USER_ID in resp.text or "draft" in resp.text
print("/api/history test passed!\n")
