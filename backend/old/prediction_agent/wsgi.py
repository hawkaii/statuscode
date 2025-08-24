import os
from app import app

if __name__ == "__main__":
    # Production WSGI server configuration
    import gunicorn.app.base
    
    class StandaloneApplication(gunicorn.app.base.BaseApplication):
        def __init__(self, app, options=None):
            self.options = options or {}
            self.application = app
            super().__init__()
        
        def load_config(self):
            config = {key: value for key, value in self.options.items()
                     if key in self.cfg.settings and value is not None}
            for key, value in config.items():
                self.cfg.set(key.lower(), value)
        
        def load(self):
            return self.application
    
    options = {
        'bind': f'{os.getenv("HOST", "0.0.0.0")}:{os.getenv("PORT", "5002")}',
        'workers': int(os.getenv('WORKERS', '4')),
        'worker_class': 'sync',
        'worker_connections': int(os.getenv('WORKER_CONNECTIONS', '1000')),
        'max_requests': int(os.getenv('MAX_REQUESTS', '1000')),
        'max_requests_jitter': int(os.getenv('MAX_REQUESTS_JITTER', '100')),
        'timeout': int(os.getenv('TIMEOUT', '30')),
        'keepalive': int(os.getenv('KEEPALIVE', '2')),
        'preload_app': True,
        'access_log_format': '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s',
    }
    
    StandaloneApplication(app, options).run()