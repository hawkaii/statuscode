# Academic Admission Prediction Agent

A Flask-based REST API service that predicts university admission probabilities using machine learning models trained on academic performance data.

## Features

- **Multi-University Predictions**: Get admission probability predictions for all 50+ universities in the training dataset
- **Single University Predictions**: Get targeted predictions for specific universities
- **Calibrated Probabilities**: Uses calibrated classifiers for reliable probability estimates
- **Comprehensive Validation**: Input validation with appropriate error handling
- **Performance Monitoring**: Request tracking, timing, and health check endpoints

## Quick Start

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Installation

1. **Clone and navigate to the project directory**
   ```bash
   cd prediction_agent
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the model (if not already done)**
   ```bash
   python train_and_pickle.py
   ```

5. **Start the API server**
   ```bash
   python academic_api.py
   ```

The API will be available at `http://localhost:5003`

## API Endpoints

### 1. Health Check
```http
GET /health
```

Returns service status and model information.

**Response:**
```json
{
  "status": "healthy",
  "service": "academic_prediction_agent",
  "model_loaded": true,
  "universities_available": 50,
  "timestamp": 1755974825.766
}
```

### 2. Multi-University Prediction
```http
POST /predict
```

Get admission probabilities for all universities, ranked by likelihood.

**Request Body:**
```json
{
  "researchExp": 5,
  "industryExp": 1,
  "toeflScore": 120.0,
  "gmatA": 6.0,
  "cgpa": 7.0,
  "gmatQ": 45.0,
  "cgpaScale": 10,
  "gmatV": 39.0,
  "gre_total": 317.0,
  "researchPubs": 10
}
```

**Response:**
```json
{
  "predictions": [
    {
      "univName": "New Jersey Institute of Technology",
      "p_admit": 0.9970477419032143
    },
    {
      "univName": "Wayne State University", 
      "p_admit": 0.994522846298118
    }
  ],
  "metadata": {
    "total_universities": 50,
    "top_results_count": 50,
    "request_id": "req_1755974825751",
    "timestamp": 1755974825.766,
    "processing_time_ms": 15.16
  }
}
```

### 3. Single University Prediction
```http
POST /predict_single
```

Get admission probability for a specific university.

**Request Body:**
```json
{
  "researchExp": 5,
  "industryExp": 1,
  "toeflScore": 120.0,
  "gmatA": 6.0,
  "cgpa": 7.0,
  "gmatQ": 45.0,
  "cgpaScale": 10,
  "gmatV": 39.0,
  "gre_total": 317.0,
  "researchPubs": 10,
  "univName": "Stanford University"
}
```

**Response:**
```json
{
  "prediction": {
    "admit_probability": 0.493,
    "admit_prediction": false,
    "university": "Stanford University"
  },
  "metadata": {
    "request_id": "req_1755974830562",
    "timestamp": 1755974830.571,
    "processing_time_ms": 8.37
  }
}
```

### 4. Available Universities
```http
GET /universities
```

Get list of all universities available for prediction.

**Response:**
```json
{
  "universities": ["Arizona State University", "Carnegie Mellon University", ...],
  "count": 50,
  "timestamp": 1755974825.766
}
```

## Input Parameters

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `researchExp` | int | 0-50 | Years of research experience |
| `industryExp` | int | 0-50 | Years of industry experience |
| `toeflScore` | float | 0-120 | TOEFL score |
| `gmatA` | float | 0-6 | GMAT Analytical Writing score |
| `cgpa` | float | 0-10 | Cumulative GPA |
| `gmatQ` | float | 0-60 | GMAT Quantitative score |
| `cgpaScale` | int | 4-10 | CGPA scale (4.0 or 10.0) |
| `gmatV` | float | 0-60 | GMAT Verbal score |
| `gre_total` | float | 260-340 | Total GRE score |
| `researchPubs` | int | 0-100 | Number of research publications |
| `univName` | string | - | University name (for single predictions only) |

## Model Information

- **Algorithm**: Logistic Regression with L2 regularization
- **Calibration**: Sigmoid calibration using 5-fold cross-validation
- **Features**: Standardized numeric features + one-hot encoded university names
- **Training Data**: 25+ samples per university minimum
- **Output**: Calibrated admission probabilities (0.0 to 1.0)

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5003 | Server port |
| `HOST` | 0.0.0.0 | Server host |
| `DEBUG` | false | Debug mode |

## File Structure

```
prediction_agent/
├── academic_api.py          # Main API server
├── train_and_pickle.py      # Model training script
├── academic_model.pkl       # Trained model (generated)
├── output.csv              # Training data
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Error Handling

The API provides detailed error messages for:
- Invalid input data types
- Missing required fields
- Out-of-range parameter values
- Unknown universities
- Model loading failures

## Example Usage

### cURL Examples

**Get all university predictions:**
```bash
curl -X POST http://localhost:5003/predict \
  -H "Content-Type: application/json" \
  -d '{
    "researchExp": 5,
    "industryExp": 1,
    "toeflScore": 120.0,
    "gmatA": 6.0,
    "cgpa": 7.0,
    "gmatQ": 45.0,
    "cgpaScale": 10,
    "gmatV": 39.0,
    "gre_total": 317.0,
    "researchPubs": 10
  }'
```

**Get prediction for specific university:**
```bash
curl -X POST http://localhost:5003/predict_single \
  -H "Content-Type: application/json" \
  -d '{
    "researchExp": 5,
    "industryExp": 1,
    "toeflScore": 120.0,
    "gmatA": 6.0,
    "cgpa": 7.0,
    "gmatQ": 45.0,
    "cgpaScale": 10,
    "gmatV": 39.0,
    "gre_total": 317.0,
    "researchPubs": 10,
    "univName": "Stanford University"
  }'
```

### Python Example

```python
import requests
import json

# Applicant profile
profile = {
    "researchExp": 5,
    "industryExp": 1,
    "toeflScore": 120.0,
    "gmatA": 6.0,
    "cgpa": 7.0,
    "gmatQ": 45.0,
    "cgpaScale": 10,
    "gmatV": 39.0,
    "gre_total": 317.0,
    "researchPubs": 10
}

# Get predictions for all universities
response = requests.post(
    'http://localhost:5003/predict',
    headers={'Content-Type': 'application/json'},
    data=json.dumps(profile)
)

results = response.json()
print(f"Top 5 universities:")
for i, pred in enumerate(results['predictions'][:5]):
    print(f"{i+1}. {pred['univName']}: {pred['p_admit']:.1%}")
```

## Production Deployment

For production deployment, consider:

1. **Use a production WSGI server** (e.g., Gunicorn):
   ```bash
   gunicorn --workers 4 --bind 0.0.0.0:5003 academic_api:app
   ```

2. **Set up reverse proxy** (nginx/Apache)
3. **Configure environment variables**
4. **Set up monitoring and logging**
5. **Implement rate limiting**

## Dependencies

- Flask 3.1.2+
- Flask-CORS 6.0.1+
- pandas 2.3.2+
- numpy 2.3.2+
- scikit-learn 1.7.1+

See `requirements.txt` for complete list.

## License

This project is part of the UniCompass backend system.