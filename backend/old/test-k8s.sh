#!/bin/bash

# UniCompass Backend Testing with Minikube
# This script tests only the backend services (no frontend)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if minikube is installed
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v minikube &> /dev/null; then
        log_error "minikube is not installed. Please install minikube first."
        echo "Install with: curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed. Please install docker first."
        exit 1
    fi
    
    log_success "All prerequisites are installed"
}

# Start minikube
start_minikube() {
    log_info "Starting minikube..."
    
    # Check if minikube is already running
    if minikube status | grep -q "Running"; then
        log_info "Minikube is already running"
    else
        # Start minikube with sufficient resources
        minikube start \
            --memory=4096 \
            --cpus=2 \
            --disk-size=20gb \
            --driver=docker
        
        log_success "Minikube started successfully"
    fi
    
    # Enable necessary addons
    log_info "Enabling minikube addons..."
    minikube addons enable ingress
    minikube addons enable metrics-server
    
    # Set docker environment
    eval $(minikube docker-env)
    log_info "Docker environment set to minikube"
}

# Build Docker images
build_images() {
    log_info "Building Docker images for backend services..."
    
    # Set docker environment to minikube
    eval $(minikube docker-env)
    
    # Build orchestrator
    log_info "Building orchestrator image..."
    docker build -t unicompass/orchestrator:latest orchestrator/
    
    # Build prediction agent
    log_info "Building prediction agent image..."
    docker build -t unicompass/prediction-agent:latest prediction_agent/
    
    # Build resume agent
    log_info "Building resume agent image..."
    docker build -t unicompass/resume-agent:latest resume_agent/
    
    # Build sop agent
    log_info "Building sop agent image..."
    docker build -t unicompass/sop-agent:latest sop_agent/
    
    log_success "All Docker images built successfully"
}

# Create Dockerfiles if they don't exist
create_dockerfiles() {
    log_info "Creating Dockerfiles if needed..."
    
    # Orchestrator Dockerfile
    if [ ! -f "orchestrator/Dockerfile" ]; then
        log_info "Creating Dockerfile for orchestrator..."
        cat > orchestrator/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || pip install flask requests flask-cors

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

EXPOSE 5000

CMD ["python", "app.py"]
EOF
    fi
    
    # Prediction Agent Dockerfile
    if [ ! -f "prediction_agent/Dockerfile" ]; then
        log_info "Creating Dockerfile for prediction agent..."
        cat > prediction_agent/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || pip install flask flask-cors

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5002/health || exit 1

EXPOSE 5002

CMD ["python", "app.py"]
EOF
    fi
    
    # Resume Agent Dockerfile
    if [ ! -f "resume_agent/Dockerfile" ]; then
        log_info "Creating Dockerfile for resume agent..."
        cat > resume_agent/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || pip install flask flask-cors

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

EXPOSE 5001

CMD ["python", "app.py"]
EOF
    fi
    
    # SOP Agent Dockerfile
    if [ ! -f "sop_agent/Dockerfile" ]; then
        log_info "Creating Dockerfile for sop agent..."
        cat > sop_agent/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || pip install flask flask-cors psycopg2-binary sentence-transformers

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5003/api/health || exit 1

EXPOSE 5003

CMD ["python", "main.py"]
EOF
    fi
    
    log_success "Dockerfiles created"
}

# Deploy backend services
deploy_backend() {
    log_info "Deploying backend services to Kubernetes..."
    
    # Apply namespace and base services (postgres, secrets)
    kubectl apply -f k8s-manifests/backend-base.yaml
    
    # Wait for postgres to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    kubectl wait --namespace=unicompass-backend \
        --for=condition=ready pod \
        --selector=app=postgres \
        --timeout=300s
    
    # Apply backend services
    kubectl apply -f k8s-manifests/backend-services.yaml
    
    # Wait for all services to be ready
    log_info "Waiting for all backend services to be ready..."
    kubectl wait --namespace=unicompass-backend \
        --for=condition=ready pod \
        --selector=app=prediction-agent \
        --timeout=300s
        
    kubectl wait --namespace=unicompass-backend \
        --for=condition=ready pod \
        --selector=app=resume-agent \
        --timeout=300s
        
    kubectl wait --namespace=unicompass-backend \
        --for=condition=ready pod \
        --selector=app=sop-agent \
        --timeout=300s
        
    kubectl wait --namespace=unicompass-backend \
        --for=condition=ready pod \
        --selector=app=orchestrator \
        --timeout=300s
    
    log_success "All backend services deployed and ready"
}

# Test API endpoints
test_apis() {
    log_info "Testing API endpoints..."
    
    # Get orchestrator service URL
    ORCHESTRATOR_URL=$(minikube service orchestrator-service --namespace=unicompass-backend --url)
    log_info "Orchestrator URL: $ORCHESTRATOR_URL"
    
    # Test health endpoint
    log_info "Testing health endpoint..."
    if curl -f "$ORCHESTRATOR_URL/api/health"; then
        log_success "Health endpoint is working"
    else
        log_error "Health endpoint failed"
    fi
    
    # Test prediction endpoint
    log_info "Testing prediction endpoint..."
    curl -X POST "$ORCHESTRATOR_URL/api/predict" \
        -H "Content-Type: application/json" \
        -d '{"gre": 320, "toefl": 110, "gpa": 3.8}' || log_warning "Prediction endpoint test failed"
    
    # Test resume analysis endpoint
    log_info "Testing resume analysis endpoint..."
    curl -X POST "$ORCHESTRATOR_URL/api/analyze" \
        -H "Content-Type: application/json" \
        -d '{"resume_text": "Sample resume text for testing"}' || log_warning "Resume analysis endpoint test failed"
    
    # Test SOP review endpoint
    log_info "Testing SOP review endpoint..."
    curl -X POST "$ORCHESTRATOR_URL/api/review" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtb191c2VyIn0.BEOb5QrV8VHHFkQP1VblQxSeqyTZp2Adv6zRh7EZ9ug" \
        -d '{"user_id": "demo_user", "draft": "Sample SOP draft for testing"}' || log_warning "SOP review endpoint test failed"
    
    log_success "API testing completed"
}

# Show service status
show_status() {
    log_info "Backend service status:"
    echo ""
    kubectl get pods --namespace=unicompass-backend -o wide
    echo ""
    kubectl get services --namespace=unicompass-backend
    echo ""
    
    # Show service URLs
    log_info "Service URLs:"
    echo "Orchestrator: $(minikube service orchestrator-service --namespace=unicompass-backend --url)"
    echo "Direct access to individual services:"
    echo "  Prediction Agent: $(minikube service prediction-agent-service --namespace=unicompass-backend --url)"
    echo "  Resume Agent: $(minikube service resume-agent-service --namespace=unicompass-backend --url)"
    echo "  SOP Agent: $(minikube service sop-agent-service --namespace=unicompass-backend --url)"
}

# Show logs
show_logs() {
    log_info "Recent logs from services:"
    echo ""
    echo "=== Orchestrator Logs ==="
    kubectl logs --namespace=unicompass-backend -l app=orchestrator --tail=10 || echo "No orchestrator logs available"
    echo ""
    echo "=== Prediction Agent Logs ==="
    kubectl logs --namespace=unicompass-backend -l app=prediction-agent --tail=10 || echo "No prediction agent logs available"
    echo ""
    echo "=== Resume Agent Logs ==="
    kubectl logs --namespace=unicompass-backend -l app=resume-agent --tail=10 || echo "No resume agent logs available"
    echo ""
    echo "=== SOP Agent Logs ==="
    kubectl logs --namespace=unicompass-backend -l app=sop-agent --tail=10 || echo "No sop agent logs available"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up backend deployment..."
    kubectl delete namespace unicompass-backend --ignore-not-found
    log_success "Cleanup completed"
}

# Main execution
main() {
    echo "==================== UNICOMPASS BACKEND TESTING ===================="
    echo "This script will test the UniCompass backend services with minikube"
    echo "Frontend is ignored - only backend APIs will be tested"
    echo ""
    
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            start_minikube
            create_dockerfiles
            build_images
            deploy_backend
            show_status
            test_apis
            ;;
        "test")
            test_apis
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "cleanup")
            cleanup
            ;;
        "rebuild")
            log_info "Rebuilding images and redeploying..."
            eval $(minikube docker-env)
            build_images
            kubectl rollout restart deployment --namespace=unicompass-backend
            kubectl rollout status deployment --namespace=unicompass-backend --timeout=300s
            ;;
        *)
            echo "Usage: $0 [deploy|test|status|logs|cleanup|rebuild]"
            echo "  deploy  - Full deployment (default)"
            echo "  test    - Test API endpoints only"
            echo "  status  - Show service status"
            echo "  logs    - Show recent logs"
            echo "  cleanup - Remove all resources"
            echo "  rebuild - Rebuild images and restart services"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"

echo ""
echo "==================== BACKEND TESTING COMPLETE ===================="
log_success "Backend services are now running in minikube"
echo ""
echo "🔧 Useful Commands:"
echo "  kubectl get pods -n unicompass-backend                    # Check pod status"
echo "  kubectl logs -f -l app=orchestrator -n unicompass-backend # Follow orchestrator logs"
echo "  minikube service orchestrator-service -n unicompass-backend # Access orchestrator"
echo "  ./test-k8s.sh status                                      # Show status"
echo "  ./test-k8s.sh cleanup                                     # Clean up everything"
echo ""