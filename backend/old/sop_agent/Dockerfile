FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || pip install flask flask-cors psycopg2-binary sentence-transformers
COPY . .
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5003/api/health || exit 1
EXPOSE 5003
CMD ["python", "main.py"]
