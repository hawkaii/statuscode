#!/bin/bash
set -e

echo "🚀 Deploying UniCompass Unified Backend"
echo "======================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your configuration before running again"
    echo "   nano .env"
    echo ""
    echo "At minimum, change these values:"
    echo "   - SECRET_KEY (use a secure random string)"
    echo "   - DEBUG (set to 'true' for development, 'false' for production)"
    exit 1
fi

echo "✅ Environment configuration found"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt

echo "🔍 Testing application startup..."
python3 -c "from app import create_app; app = create_app(); print('✅ App created successfully')"

# Start the application
echo ""
echo "🌟 Starting UniCompass Backend..."
echo "📡 Server will be available at: http://localhost:5000"
echo "🔍 Health check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Use gunicorn for production or python for development
if [ "${DEBUG:-false}" = "true" ]; then
    echo "🔧 Starting in development mode..."
    python3 app.py
else
    echo "🚀 Starting in production mode with gunicorn..."
    gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 "app:create_app()"
fi