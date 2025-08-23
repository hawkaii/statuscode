#!/bin/bash

# SOP Agent Docker Helper Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 SOP Agent Docker Setup${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo -e "${RED}❌ docker-compose is not installed.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ Please edit .env file and set your GEMINI_API_KEY${NC}"
    exit 1
fi

# Check if GEMINI_API_KEY is set
if grep -q "your-gemini-api-key" .env; then
    echo -e "${RED}❌ Please set your actual GEMINI_API_KEY in .env file${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment check passed${NC}"

# Function to show menu
show_menu() {
    echo -e "\n${YELLOW}Select an option:${NC}"
    echo "1) Start services"
    echo "2) Stop services"
    echo "3) View logs"
    echo "4) Rebuild and restart"
    echo "5) Initialize embeddings"
    echo "6) Access app container"
    echo "7) View database"
    echo "8) Test API"
    echo "9) Exit"
    echo
}

# Function to test API
test_api() {
    echo -e "${GREEN}🧪 Testing API endpoints...${NC}"

    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 10

    # Test examples endpoint
    if curl -s http://localhost:5003/examples > /dev/null; then
        echo -e "${GREEN}✅ API is responding${NC}"
    else
        echo -e "${RED}❌ API is not responding${NC}"
    fi
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-9): " choice

    case $choice in
        1)
            echo -e "${GREEN}🚀 Starting services...${NC}"
            docker-compose up -d
            echo -e "${GREEN}✅ Services started${NC}"
            test_api
            ;;
        2)
            echo -e "${YELLOW}🛑 Stopping services...${NC}"
            docker-compose down
            echo -e "${GREEN}✅ Services stopped${NC}"
            ;;
        3)
            echo -e "${GREEN}📋 Viewing logs...${NC}"
            docker-compose logs -f
            ;;
        4)
            echo -e "${GREEN}🔄 Rebuilding and restarting...${NC}"
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d
            echo -e "${GREEN}✅ Rebuild complete${NC}"
            test_api
            ;;
        5)
            echo -e "${GREEN}🧠 Initializing embeddings...${NC}"
            docker-compose exec app python init_embeddings.py
            echo -e "${GREEN}✅ Embeddings initialized${NC}"
            ;;
        6)
            echo -e "${GREEN}🐳 Accessing app container...${NC}"
            docker-compose exec app bash
            ;;
        7)
            echo -e "${GREEN}🗄️  Accessing database...${NC}"
            docker-compose exec postgres psql -U sop_user -d sop_agent
            ;;
        8)
            test_api
            ;;
        9)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid option. Please choose 1-9.${NC}"
            ;;
    esac
done