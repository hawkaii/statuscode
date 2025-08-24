#!/bin/bash
set -e

echo "🚀 Deploying UniCompass Backend"
echo "==============================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before running again"
    echo "   nano .env"
    exit 1
fi

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
echo ""

# Check each service
services=("orchestrator:5000" "prediction-agent:5002" "resume-agent:5001" "sop-agent:5003")
all_healthy=true

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -s -f http://localhost:$port/health > /dev/null 2>&1 || curl -s -f http://localhost:$port/api/health > /dev/null 2>&1; then
        echo "✅ $name - Healthy"
    else
        echo "❌ $name - Not responding"
        all_healthy=false
    fi
done

echo ""
if [ "$all_healthy" = true ]; then
    echo "🎉 Deployment successful!"
    echo ""
    echo "📡 Services available at:"
    echo "   • API Gateway: http://$(hostname -I | awk '{print $1}'):5000"
    echo "   • Health Check: http://$(hostname -I | awk '{print $1}'):5000/api/health"
    echo ""
    echo "🔧 Management commands:"
    echo "   • View logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "   • Stop services: docker-compose -f docker-compose.prod.yml down"
    echo "   • Restart: docker-compose -f docker-compose.prod.yml restart"
else
    echo "⚠️  Some services failed to start. Check logs:"
    echo "   docker-compose -f docker-compose.prod.yml logs"
fi