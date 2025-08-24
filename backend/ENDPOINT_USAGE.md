## University Prediction API Endpoint Usage

### Your Data:
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
    "univName":"None"
}
```

### API Endpoints Available:

#### 1. Main Prediction Service
**URL:** `POST /api/prediction/predict_universities`
**Expects:** AcademicProfile format

```bash
curl -X POST http://localhost:5000/api/prediction/predict_universities \
  -H 'Content-Type: application/json' \
  -d '{
    "gpa": 2.8,
    "gre_verbal": 160,
    "gre_quantitative": 157,
    "toefl_score": 120,
    "research_experience": true,
    "publications": 10,
    "work_experience_years": 0.08,
    "major": "Computer Science",
    "target_program": "MS Computer Science"
  }'
```

#### 2. Academic API Service  
**URL:** `POST /api/academic/predict`
**Expects:** Raw model format (your exact data)

```bash
curl -X POST http://localhost:5000/api/academic/predict \
  -H 'Content-Type: application/json' \
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
    "univName":"None"
  }'
```

### Expected Response Format:

#### Main Prediction Service Response:
```json
{
  "request_id": "uuid-here",
  "timestamp": "2024-01-01T12:00:00Z",
  "profile": { ... },
  "predictions": [
    {
      "university_name": "MIT",
      "program": "MS Computer Science",
      "admission_probability": 0.85,
      "tier": "top",
      "reasoning": "Strong profile match for MIT; Excellent GPA; Excellent GRE scores; Research experience adds value; 10 publications strengthen profile",
      "requirements_met": {...},
      "recommendations": [...]
    },
    ...
  ],
  "overall_assessment": "Strong profile with excellent admission chances",
  "recommendations": [...],
  "processing_time": 0.234
}
```

#### Academic API Response:
```json
[
  {
    "univName": "Stanford University",
    "p_admit": 0.87
  },
  {
    "univName": "MIT",
    "p_admit": 0.85
  },
  ...
]
```

### Data Conversion:
Your raw data gets converted as follows:
- `cgpa: 7.0` on `cgpaScale: 10` → `gpa: 2.8` (on 4.0 scale)
- `gre_total: 317` → `gre_verbal: 160, gre_quantitative: 157`
- `researchExp: 5` → `research_experience: true`
- `researchPubs: 10` → `publications: 10`
- `industryExp: 1` (months) → `work_experience_years: 0.08`
- `toeflScore: 120` → `toefl_score: 120`

### Testing:
1. Start server: `python app.py`
2. Use curl commands above
3. Check health: `curl http://localhost:5000/health`

Your profile shows:
- **Strong research background** (5 years exp, 10 publications)
- **Excellent TOEFL** (120/120)
- **Good GRE** (317 total)
- **Moderate GPA** (7.0/10 = 2.8/4.0)

Expected to get **high admission probabilities** for research-focused programs due to strong research profile!