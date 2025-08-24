# Prediction Agent API Documentation

## Overview
The Prediction Agent is a microservice that predicts suitable universities based on academic scores (GRE, TOEFL, GPA).

## Base URL
```
http://localhost:5002
```

## Endpoints

### Health Check
**GET** `/health`

Check the health status of the service.

**Response:**
```json
{
  "status": "healthy",
  "service": "prediction_agent", 
  "timestamp": 1693234567.123
}
```

### University Prediction
**POST** `/predict_universities`

Predict suitable universities based on academic scores.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "gre": 325,
  "toefl": 110,
  "gpa": 3.8
}
```

**Parameters:**
- `gre` (integer, required): GRE score (260-340)
- `toefl` (integer, required): TOEFL score (0-120)
- `gpa` (float, required): GPA (0.0-4.0)

**Success Response (200):**
```json
{
  "universities": [
    "Massachusetts Institute of Technology (MIT)",
    "Stanford University",
    "Carnegie Mellon University", 
    "University of California, Berkeley"
  ],
  "metadata": {
    "tier": "top",
    "request_id": "req_1693234567123",
    "timestamp": 1693234567.123,
    "processing_time_ms": 5.23
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Missing required fields: gre, toefl",
  "request_id": "req_1693234567123"
}
```

**500 Internal Server Error:**
```json
{
  "error": "An internal server error occurred",
  "request_id": "req_1693234567123"
}
```

## University Tiers

### Top Tier
- **Requirements:** GRE ≥ 320, GPA ≥ 3.7, TOEFL ≥ 105
- **Universities:**
  - Massachusetts Institute of Technology (MIT)
  - Stanford University
  - Carnegie Mellon University
  - University of California, Berkeley

### Mid Tier  
- **Requirements:** GRE ≥ 310, GPA ≥ 3.5, TOEFL ≥ 95
- **Universities:**
  - University of Illinois Urbana-Champaign
  - Georgia Institute of Technology
  - University of Michigan
  - University of Texas at Austin
  - Purdue University

### Lower Tier
- **Requirements:** Below mid-tier thresholds
- **Universities:**
  - Arizona State University
  - University of Florida
  - Texas A&M University
  - Ohio State University

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5002` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `DEBUG` | `false` | Debug mode |
| `LOG_LEVEL` | `INFO` | Logging level |

## Running the Service

### Development
```bash
python app.py
```

### Production
```bash  
python wsgi.py
```

### Docker
```bash
docker build -t prediction-agent .
docker run -p 5002:5002 prediction-agent
```

## Logging
The service logs to both console and `prediction_agent.log` file with structured logging including request IDs for tracing.