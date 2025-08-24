# Use Alpine Linux for smaller, faster builds on Railway
FROM python:3.11-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies (Alpine packages are smaller and faster)
RUN apk add --no-cache \
    gcc \
    musl-dev \
    linux-headers \
    curl \
    && rm -rf /var/cache/apk/*

# Copy and install Python dependencies first (better caching)
COPY requirements.txt .

# Install Python packages with retry logic for Railway connection issues
RUN pip install --no-cache-dir --timeout 60 -r requirements.txt || \
    (echo "Retrying pip install..." && sleep 5 && pip install --no-cache-dir --timeout 60 -r requirements.txt) || \
    (echo "Final retry with extended timeout..." && sleep 10 && pip install --no-cache-dir --timeout 120 -r requirements.txt)

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs uploads \
    && chmod 755 logs uploads

# Create non-root user for security (Alpine style)
RUN adduser -D -s /bin/sh app \
    && chown -R app:app /app

# Switch to non-root user
USER app

# Expose port for Railway
EXPOSE 5000

# Simple startup command that works reliably on Railway
CMD ["python", "app.py"]