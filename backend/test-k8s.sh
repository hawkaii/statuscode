#!/bin/bash

echo "Testing Kubernetes deployment with minikube..."

# Start minikube (try different drivers)
echo "Starting minikube..."
if ! minikube start --driver=docker 2>/dev/null; then
    echo "Docker driver failed, trying with podman..."
    if ! minikube start --driver=podman 2>/dev/null; then
        echo "Podman driver failed, trying with none driver..."
        if ! minikube start --driver=none --apiserver-ips=127.0.0.1; then
            echo "Failed to start minikube with any driver. Please check your setup."
            exit 1
        fi
    fi
fi

echo "Minikube started successfully!"

# Load images into minikube (only for docker/podman drivers)
if [ "$(minikube config get driver)" != "none" ]; then
    echo "Loading images into minikube..."
    minikube image load unicompass/prediction-agent:latest
    minikube image load unicompass/resume-agent:latest
    minikube image load unicompass/sop-agent:latest
    minikube image load unicompass/orchestrator:latest
fi

# Apply Kubernetes manifests
echo "Applying Kubernetes manifests..."
kubectl apply -f k8s-manifests/secrets.yaml
kubectl apply -f k8s-manifests/postgres-deployment.yaml
kubectl apply -f k8s-manifests/prediction-agent-deployment.yaml
kubectl apply -f k8s-manifests/resume-agent-deployment.yaml
kubectl apply -f k8s-manifests/sop-agent-deployment.yaml
kubectl apply -f k8s-manifests/orchestrator-deployment.yaml

echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres
kubectl wait --for=condition=available --timeout=300s deployment/prediction-agent
kubectl wait --for=condition=available --timeout=300s deployment/resume-agent
kubectl wait --for=condition=available --timeout=300s deployment/sop-agent
kubectl wait --for=condition=available --timeout=300s deployment/orchestrator

echo "Getting service URLs..."
minikube service list

echo "Testing services..."
# Test prediction agent
echo "Testing prediction agent..."
kubectl port-forward service/prediction-agent-service 8002:5002 &
PF_PID1=$!
sleep 5
curl -s http://localhost:8002/health || echo "Prediction agent health check failed"
kill $PF_PID1

# Test resume agent  
echo "Testing resume agent..."
kubectl port-forward service/resume-agent-service 8001:5001 &
PF_PID2=$!
sleep 5
curl -s http://localhost:8001/ || echo "Resume agent connection failed"
kill $PF_PID2

# Test SOP agent
echo "Testing SOP agent..."
kubectl port-forward service/sop-agent-service 8003:5003 &
PF_PID3=$!
sleep 5
curl -s http://localhost:8003/ || echo "SOP agent connection failed"
kill $PF_PID3

# Test orchestrator
echo "Testing orchestrator..."
kubectl port-forward service/orchestrator-service 8000:5000 &
PF_PID4=$!
sleep 5
curl -s http://localhost:8000/ || echo "Orchestrator connection failed"
kill $PF_PID4

echo "Kubernetes testing completed!"
echo "Run 'kubectl get pods' to check pod status"
echo "Run 'kubectl get services' to check service status"