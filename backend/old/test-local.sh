#!/bin/bash

# Simple Backend Test - No Docker Required
# Tests backend services locally

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Test orchestrator endpoints without backend services
test_orchestrator_standalone() {
    log_info "Testing orchestrator standalone (without backend services)..."
    
    cd orchestrator
    
    # Start orchestrator in background
    python app.py &
    ORCHESTRATOR_PID=$!
    
    # Wait for it to start
    sleep 3
    
    # Test basic endpoint
    if curl -s -f "http://localhost:5000/" > /dev/null; then
        log_success "Orchestrator is responding"
    else
        log_error "Orchestrator is not responding"
    fi
    
    # Test health endpoint (should work even without backend services)
    if curl -s -f "http://localhost:5000/api/health" | grep -q "orchestrator"; then
        log_success "Health endpoint working"
    else
        log_error "Health endpoint failed"
    fi
    
    # Kill orchestrator
    kill $ORCHESTRATOR_PID 2>/dev/null || true
    cd ..
}

# Test prediction agent standalone
test_prediction_agent() {
    log_info "Testing prediction agent standalone..."
    
    cd prediction_agent
    
    # Start prediction agent in background
    python app.py &
    PRED_PID=$!
    
    # Wait for it to start
    sleep 3
    
    # Test health endpoint
    if curl -s -f "http://localhost:5002/health" > /dev/null; then
        log_success "Prediction agent health check working"
    else
        log_error "Prediction agent health check failed"
    fi
    
    # Test prediction endpoint
    if curl -s -X POST "http://localhost:5002/predict_universities" \
        -H "Content-Type: application/json" \
        -d '{"gre": 320, "toefl": 110, "gpa": 3.8}' | grep -q "universities"; then
        log_success "Prediction endpoint working"
    else
        log_error "Prediction endpoint failed"
    fi
    
    # Kill prediction agent
    kill $PRED_PID 2>/dev/null || true
    cd ..
}

# Test resume agent standalone  
test_resume_agent() {
    log_info "Testing resume agent standalone..."
    
    cd resume_agent
    
    # Start resume agent in background
    python app.py &
    RESUME_PID=$!
    
    # Wait for it to start
    sleep 3
    
    # Test health endpoint
    if curl -s -f "http://localhost:5001/health" > /dev/null; then
        log_success "Resume agent health check working"
    else
        log_error "Resume agent health check failed"
    fi
    
    # Test analysis endpoint (should handle gracefully without real API keys)
    if curl -s -X POST "http://localhost:5001/analyze_resume" \
        -H "Content-Type: application/json" \
        -d '{"resume_text": "Test resume"}' | grep -q "error\|ats_score\|feedback"; then
        log_success "Resume analysis endpoint responding"
    else
        log_error "Resume analysis endpoint not responding"
    fi
    
    # Kill resume agent
    kill $RESUME_PID 2>/dev/null || true
    cd ..
}

# Main test
main() {
    echo "==================== SIMPLE BACKEND TEST ===================="
    echo "Testing backend services locally without Docker"
    echo ""
    
    # Check if Python is available
    if ! command -v python &> /dev/null; then
        if command -v python3 &> /dev/null; then
            alias python=python3
        else
            log_error "Python is not installed"
            exit 1
        fi
    fi
    
    # Install basic requirements if needed
    log_info "Installing basic requirements..."
    pip install flask flask-cors requests 2>/dev/null || true
    
    # Test each service
    case "${1:-all}" in
        "orchestrator")
            test_orchestrator_standalone
            ;;
        "prediction")  
            test_prediction_agent
            ;;
        "resume")
            test_resume_agent
            ;;
        "all"|"")
            test_orchestrator_standalone
            test_prediction_agent
            test_resume_agent
            ;;
        *)
            echo "Usage: $0 [orchestrator|prediction|resume|all]"
            exit 1
            ;;
    esac
    
    log_success "Local backend testing completed!"
}

# Cleanup on exit
cleanup() {
    pkill -f "python app.py" 2>/dev/null || true
}

trap cleanup EXIT

main "$@"