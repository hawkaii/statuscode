# UniCompass Frontend Deployment Plan (Docker + Nginx)

## 1. Build and Serve Frontend with Docker

### Dockerfile Example

```Dockerfile
# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm run export

# Serve static files
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
```

### Build and Run Container

```bash
# Navigate to your frontend directory
cd /var/www/unicompass/ui

# Build Docker image
docker build -t unicompass-frontend .

# Run container (serves on port 3000)
docker run -d --name unicompass-frontend -p 3000:80 unicompass-frontend
```

---

## 2. Nginx Reverse Proxy Configuration

Update your main Nginx config to proxy `/` to the Docker container:

```nginx
server {
    listen 80;
    server_name 139.84.170.181;

    client_max_body_size 20M;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        # ...headers and timeouts...
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        # ...headers...
    }
}
```

---

## 3. Permissions

- Ensure Nginx and Docker have access to the build directory and ports.

---

## 4. Testing

- Visit `http://139.84.170.181/` — should show your frontend.
- Visit `/api/` and `/health` — should proxy to backend.

---

## 5. Troubleshooting

- If you see a 404, check `try_files` and file placement.
- If API requests fail, check the `/api/` proxy block.
- If assets don't load, check permissions and Nginx error logs.

---

## Summary Table

| Path         | Served By         | Nginx Block         | Directory/Port                  |
|--------------|-------------------|---------------------|----------------------------------|
| `/`          | Next.js frontend  | `location /`        | Docker container (port 3000)     |
| `/api/`      | Flask backend     | `location /api/`    | (proxied to Flask, port 5000)    |
| `/health`    | Flask backend     | `location /health`  | (proxied to Flask, port 5000)    |

