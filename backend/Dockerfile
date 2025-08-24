# Use Python slim (Debian-based) for better NumPy compatibility
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

# Set work directory
WORKDIR /app

# Install system dependencies needed for NumPy and scientific packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt .

# Install packages (NumPy will use pre-built wheels when possible)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs uploads && \
    chmod 755 logs uploads

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash --system app && \
    chown -R app:app /app

# Switch to non-root user
USER app

# Expose port for Railway
EXPOSE 5000

# Start the application
CMD ["python", "app.py"]