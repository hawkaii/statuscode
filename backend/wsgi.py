#!/usr/bin/env python3
"""
Production WSGI application for Railway deployment
"""

import os
from app import app, logger

# Configure for production
if __name__ != '__main__':
    # This runs when imported by gunicorn
    railway_env = os.environ.get('RAILWAY_ENVIRONMENT', 'production')
    logger.info(f"Starting UniCompass in {railway_env} environment")

# For gunicorn
application = app

if __name__ == '__main__':
    # Fallback for direct execution
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))