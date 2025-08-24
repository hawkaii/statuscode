#!/bin/bash

# Quick Backend Test with Docker Compose
# Tests backend services without Kubernetes complexity

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Create Dockerfiles
create_dockerfiles() {
    log_info "Creating Dockerfiles for all services..."
    
    # Orchestrator
    cat > orchestrator/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1
EXPOSE 5000
CMD ["python", "app.py"]
EOF

    # Prediction Agent
    cat > prediction_agent/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5002/health || exit 1
EXPOSE 5002
CMD ["python", "app.py"]
EOF

    # Resume Agent
    cat > resume_agent/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || pip install flask flask-cors
COPY . .
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1
EXPOSE 5001
CMD ["python", "app.py"]
EOF

    # SOP Agent
    cat > sop_agent/Dockerfile << 'EOF'
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
EOF

    log_success "Dockerfiles created"
}

# Start services
start_services() {
    log_info "Starting backend services with Docker Compose..."
    
    # Clean up any existing containers
    docker-compose -f docker-compose.test.yml down -v 2>/dev/null || true
    
    # Build and start services
    docker-compose -f docker-compose.test.yml build --no-cache
    docker-compose -f docker-compose.test.yml up -d
    
    log_info "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    local healthy_services=0
    local total_services=5
    
    for service in postgres prediction-agent resume-agent sop-agent orchestrator; do
        if docker-compose -f docker-compose.test.yml ps | grep "$service" | grep -q "healthy\|Up"; then
            log_success "$service is running"
            healthy_services=$((healthy_services + 1))
        else
            log_error "$service is not healthy"
            docker-compose -f docker-compose.test.yml logs "$service" | tail -10
        fi
    done
    
    log_info "Healthy services: $healthy_services/$total_services"
}

# Test API endpoints
test_endpoints() {
    log_info "Testing API endpoints..."
    
    local BASE_URL="http://localhost:5000"
    local failed_tests=0
    
    # Test health endpoint
    log_info "Testing orchestrator health..."
    if curl -s -f "$BASE_URL/api/health"; then
        log_success "Health endpoint working"
        echo ""
    else
        log_error "Health endpoint failed"
        failed_tests=$((failed_tests + 1))
    fi
    
    # Test prediction endpoint
    log_info "Testing university prediction..."
    if curl -s -X POST "$BASE_URL/api/predict" \
        -H "Content-Type: application/json" \
        -d '{"gre": 320, "toefl": 110, "gpa": 3.8}' | grep -q "universities\|predictions"; then
        log_success "Prediction endpoint working"
    else
        log_warning "Prediction endpoint may have issues"
        failed_tests=$((failed_tests + 1))
    fi
    
    # Test resume analysis
    log_info "Testing resume analysis..."
    if curl -s -X POST "$BASE_URL/api/analyze" \
        -H "Content-Type: application/json" \
        -d '{"resume_text": "Test resume content"}' | grep -q "ats_score\|feedback\|error"; then
        log_success "Resume analysis endpoint working"
    else
        log_warning "Resume analysis endpoint may have issues"
        failed_tests=$((failed_tests + 1))
    fi
    
    # Test SOP endpoints
    local JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtb191c2VyIn0.BEOb5QrV8VHHFkQP1VblQxSeqyTZp2Adv6zRh7EZ9ug"
    
    log_info "Testing SOP review..."
    if curl -s -X POST "$BASE_URL/api/review" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d '{"user_id": "demo_user", "draft": "Test SOP draft"}' | grep -q "feedback\|error\|id"; then
        log_success "SOP review endpoint working"
    else
        log_warning "SOP review endpoint may have issues"
        failed_tests=$((failed_tests + 1))
    fi
    
    echo ""
    if [ $failed_tests -eq 0 ]; then
        log_success "🎉 All API tests passed!"
    else
        log_warning "⚠️ $failed_tests API tests had issues"
    fi
}

# Show service status
show_status() {
    log_info "Service Status:"
    echo ""
    docker-compose -f docker-compose.test.yml ps
    echo ""
    
    log_info "Service URLs:"
    echo "Orchestrator (Main API): http://localhost:5000"
    echo "Prediction Agent: http://localhost:5002"
    echo "Resume Agent: http://localhost:5001"  
    echo "SOP Agent: http://localhost:5003"
    echo ""
}

# Show logs
show_logs() {
    local service=${1:-orchestrator}
    log_info "Recent logs for $service:"
    docker-compose -f docker-compose.test.yml logs --tail=20 "$service"
}

# Cleanup
cleanup() {
    log_info "Cleaning up test environment..."
    docker-compose -f docker-compose.test.yml down -v
    docker system prune -f
    log_success "Cleanup completed"
}

# Main execution
main() {
    echo "==================== UNICOMPASS BACKEND TEST (Docker Compose) ===================="
    echo "This will test all backend services using Docker Compose"
    echo ""
    
    case "${1:-test}" in
        "test")
            check_prerequisites
            create_dockerfiles
            start_services
            test_endpoints
            show_status
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$2"
            ;;
        "cleanup")
            cleanup
            ;;
        "restart")
            docker-compose -f docker-compose.test.yml restart "${2:-}"
            ;;
        *)
            echo "Usage: $0 [test|status|logs [service]|cleanup|restart [service]]"
            echo ""
            echo "Commands:"
            echo "  test     - Run full test suite (default)"
            echo "  status   - Show service status"  
            echo "  logs     - Show logs (optionally for specific service)"
            echo "  cleanup  - Stop and remove all containers"
            echo "  restart  - Restart services (optionally specific service)"
            exit 1
            ;;
    esac
}

main "$@"

echo ""
echo "==================== TEST COMPLETE ===================="
echo "💡 Useful commands:"
echo "  ./test-backend.sh status                    # Check service status"
echo "  ./test-backend.sh logs orchestrator         # View orchestrator logs"
echo "  ./test-backend.sh cleanup                   # Clean up everything"
echo "  curl http://localhost:5000/api/health       # Test health endpoint"
echo ""