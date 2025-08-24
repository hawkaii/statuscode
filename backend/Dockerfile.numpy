# Dockerfile optimized for NumPy and scientific packages on Railway
FROM python:3.11-slim

# Set environment variables for better NumPy builds
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive \
    NPY_NUM_BUILD_JOBS=2

# Set work directory
WORKDIR /app

# Install system dependencies for NumPy/SciPy compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    gfortran \
    libblas-dev \
    liblapack-dev \
    libopenblas-dev \
    pkg-config \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install in stages
COPY requirements.txt .

# Install packages in specific order for better caching
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir numpy==1.24.3 && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs uploads && \
    chmod 755 logs uploads

# Create non-root user
RUN useradd --create-home --shell /bin/bash --system app && \
    chown -R app:app /app

# Switch to non-root user
USER app

# Expose port
EXPOSE 5000

# Start application
CMD ["python", "app.py"]