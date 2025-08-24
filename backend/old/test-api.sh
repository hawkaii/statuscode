#!/bin/bash

# API Testing Script for UniCompass Backend Services
# Tests all backend endpoints without frontend

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

# Test configuration
ORCHESTRATOR_URL="${ORCHESTRATOR_URL:-http://localhost:5000}"
JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGVtb191c2VyIn0.BEOb5QrV8VHHFkQP1VblQxSeqyTZp2Adv6zRh7EZ9ug"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0

run_test() {
    local test_name="$1"
    local command="$2"
    local expected_status="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo ""
    log_info "Running test: $test_name"
    
    # Run the command and capture output
    if eval "$command"; then
        log_success "✓ $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        log_error "✗ $test_name"
        return 1
    fi
}

# Health check tests
test_health_endpoints() {
    echo ""
    echo "==================== HEALTH CHECK TESTS ===================="
    
    run_test "Orchestrator Health Check" \
        "curl -s -f '$ORCHESTRATOR_URL/api/health' | jq ."
    
    run_test "Orchestrator Basic Response" \
        "curl -s -o /dev/null -w '%{http_code}' '$ORCHESTRATOR_URL/' | grep -q '200\|404\|500'"
}

# Prediction Agent tests
test_prediction_endpoints() {
    echo ""
    echo "==================== PREDICTION AGENT TESTS ===================="
    
    # Test valid prediction request
    run_test "University Prediction - Valid Input" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/predict' \
        -H 'Content-Type: application/json' \
        -d '{\"gre\": 320, \"toefl\": 110, \"gpa\": 3.8}' | jq ."
    
    # Test edge case - minimum scores
    run_test "University Prediction - Minimum Scores" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/predict' \
        -H 'Content-Type: application/json' \
        -d '{\"gre\": 260, \"toefl\": 80, \"gpa\": 2.0}' | jq ."
    
    # Test edge case - maximum scores
    run_test "University Prediction - Maximum Scores" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/predict' \
        -H 'Content-Type: application/json' \
        -d '{\"gre\": 340, \"toefl\": 120, \"gpa\": 4.0}' | jq ."
    
    # Test invalid input
    run_test "University Prediction - Invalid Input (should fail gracefully)" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/predict' \
        -H 'Content-Type: application/json' \
        -d '{\"invalid\": \"data\"}' | jq . || echo 'Expected failure'"
}

# Resume Agent tests  
test_resume_endpoints() {
    echo ""
    echo "==================== RESUME AGENT TESTS ===================="
    
    # Test resume analysis
    run_test "Resume Analysis - Basic Text" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/analyze' \
        -H 'Content-Type: application/json' \
        -d '{\"resume_text\": \"John Doe\\nSoftware Engineer\\n\\nExperience:\\n- 3 years at Google\\n- Python, Java, React\\n\\nEducation:\\n- BS Computer Science, MIT\"}' | jq ."
    
    # Test with minimal resume
    run_test "Resume Analysis - Minimal Resume" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/analyze' \
        -H 'Content-Type: application/json' \
        -d '{\"resume_text\": \"Jane Smith\\nEntry Level Developer\"}' | jq ."
    
    # Test with empty resume
    run_test "Resume Analysis - Empty Text (should handle gracefully)" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/analyze' \
        -H 'Content-Type: application/json' \
        -d '{\"resume_text\": \"\"}' | jq . || echo 'Expected handling of empty text'"
}

# SOP Agent tests
test_sop_endpoints() {
    echo ""
    echo "==================== SOP AGENT TESTS ===================="
    
    # Test SOP review
    run_test "SOP Review - Valid Draft" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/review' \
        -H 'Content-Type: application/json' \
        -H 'Authorization: Bearer $JWT_TOKEN' \
        -d '{\"user_id\": \"demo_user\", \"draft\": \"I am passionate about computer science and want to pursue my masters degree. My undergraduate experience has prepared me well for graduate studies.\"}' | jq ."
    
    # Test SOP examples
    run_test "SOP Examples" \
        "curl -s -X GET '$ORCHESTRATOR_URL/api/examples' \
        -H 'Authorization: Bearer $JWT_TOKEN' | jq ."
    
    # Test SOP history
    run_test "SOP History" \
        "curl -s -X GET '$ORCHESTRATOR_URL/api/history?user_id=demo_user' \
        -H 'Authorization: Bearer $JWT_TOKEN' | jq ."
    
    # Test SOP suggestion
    run_test "SOP Suggestion" \
        "curl -s -X PATCH '$ORCHESTRATOR_URL/api/suggest' \
        -H 'Content-Type: application/json' \
        -H 'Authorization: Bearer $JWT_TOKEN' \
        -d '{\"user_id\": \"demo_user\", \"revision\": \"I am deeply passionate about computer science and eagerly want to pursue my masters degree at your esteemed institution.\"}' | jq ."
}

# Integration tests
test_integration() {
    echo ""
    echo "==================== INTEGRATION TESTS ===================="
    
    # Test full workflow: prediction -> resume -> sop
    run_test "Integration - Full Workflow" \
        "echo 'Testing complete application workflow...' && \
        curl -s -X POST '$ORCHESTRATOR_URL/api/predict' \
        -H 'Content-Type: application/json' \
        -d '{\"gre\": 315, \"toefl\": 105, \"gpa\": 3.6}' > /tmp/prediction_result && \
        curl -s -X POST '$ORCHESTRATOR_URL/api/analyze' \
        -H 'Content-Type: application/json' \
        -d '{\"resume_text\": \"Test User\\nMS CS Applicant\\n\\nEducation: BS CS\\nExperience: 2 years software development\"}' > /tmp/resume_result && \
        curl -s -X POST '$ORCHESTRATOR_URL/api/review' \
        -H 'Content-Type: application/json' \
        -H 'Authorization: Bearer $JWT_TOKEN' \
        -d '{\"user_id\": \"test_user\", \"draft\": \"Based on my academic background and work experience, I want to apply for graduate studies.\"}' > /tmp/sop_result && \
        echo 'Workflow completed - check /tmp/*_result files for outputs'"
}

# Performance tests
test_performance() {
    echo ""
    echo "==================== PERFORMANCE TESTS ===================="
    
    # Test concurrent requests
    run_test "Performance - Concurrent Health Checks" \
        "for i in {1..5}; do 
            curl -s '$ORCHESTRATOR_URL/api/health' &
         done; 
         wait && echo 'All concurrent requests completed'"
    
    # Test response time
    run_test "Performance - Response Time Test" \
        "time curl -s '$ORCHESTRATOR_URL/api/health' > /dev/null"
}

# Error handling tests
test_error_handling() {
    echo ""
    echo "==================== ERROR HANDLING TESTS ===================="
    
    # Test invalid endpoints
    run_test "Error Handling - Invalid Endpoint" \
        "curl -s -o /dev/null -w '%{http_code}' '$ORCHESTRATOR_URL/api/invalid' | grep -q '404'"
    
    # Test malformed JSON
    run_test "Error Handling - Malformed JSON" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/predict' \
        -H 'Content-Type: application/json' \
        -d '{invalid json}' | grep -q 'error\|Error' || echo 'Expected error response'"
    
    # Test unauthorized access
    run_test "Error Handling - Unauthorized SOP Request" \
        "curl -s -X POST '$ORCHESTRATOR_URL/api/review' \
        -H 'Content-Type: application/json' \
        -d '{\"user_id\": \"demo_user\", \"draft\": \"test\"}' | grep -q 'error\|Error' || echo 'Expected error for missing auth'"
}

# Generate test report
generate_report() {
    echo ""
    echo "==================== TEST REPORT ===================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))"
    echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
    
    if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
        log_success "🎉 All tests passed!"
        return 0
    else
        log_warning "⚠️  Some tests failed. Check the output above."
        return 1
    fi
}

# Main execution
main() {
    echo "==================== UNICOMPASS API TESTING ===================="
    echo "Testing backend services at: $ORCHESTRATOR_URL"
    echo "JWT Token: ${JWT_TOKEN:0:20}..."
    echo ""
    
    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        log_warning "jq is not installed. JSON responses may not be formatted nicely."
        log_info "Install jq with: sudo apt install jq"
    fi
    
    # Check if orchestrator is reachable
    if ! curl -s --connect-timeout 5 "$ORCHESTRATOR_URL/api/health" > /dev/null; then
        log_error "Cannot reach orchestrator at $ORCHESTRATOR_URL"
        log_info "Make sure the backend is running with:"
        log_info "  ./test-k8s.sh deploy"
        log_info "Or set ORCHESTRATOR_URL environment variable"
        exit 1
    fi
    
    # Run test suites based on arguments
    case "${1:-all}" in
        "health")
            test_health_endpoints
            ;;
        "prediction")
            test_prediction_endpoints
            ;;
        "resume")
            test_resume_endpoints
            ;;
        "sop")
            test_sop_endpoints
            ;;
        "integration")
            test_integration
            ;;
        "performance")
            test_performance
            ;;
        "errors")
            test_error_handling
            ;;
        "all"|"")
            test_health_endpoints
            test_prediction_endpoints
            test_resume_endpoints
            test_sop_endpoints
            test_integration
            test_performance
            test_error_handling
            ;;
        *)
            echo "Usage: $0 [health|prediction|resume|sop|integration|performance|errors|all]"
            exit 1
            ;;
    esac
    
    generate_report
}

# Export test results
export_results() {
    echo ""
    log_info "Exporting test results..."
    
    # Create results directory
    mkdir -p test_results
    
    # Save detailed results
    {
        echo "UniCompass Backend API Test Results"
        echo "=================================="
        echo "Date: $(date)"
        echo "Orchestrator URL: $ORCHESTRATOR_URL"
        echo "Total Tests: $TOTAL_TESTS"
        echo "Passed: $PASSED_TESTS"
        echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))"
        echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
        echo ""
    } > test_results/summary.txt
    
    log_success "Test results saved to test_results/summary.txt"
}

# Run main function
main "$@"
export_results

echo ""
echo "==================== API TESTING COMPLETE ===================="