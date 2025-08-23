#!/bin/bash

# Build Docker images
echo "Building Docker images..."

# Build prediction agent
docker build -t unicompass/prediction-agent:latest ./prediction_agent/

# Build resume agent  
docker build -t unicompass/resume-agent:latest ./resume_agent/

# Build SOP agent
docker build -t unicompass/sop-agent:latest ./sop_agent/

# Create simple Dockerfile for orchestrator
cat > orchestrator/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN pip install flask requests

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
EOF

# Build orchestrator
docker build -t unicompass/orchestrator:latest ./orchestrator/

echo "All images built successfully!"