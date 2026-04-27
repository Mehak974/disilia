import sys
import os

# Set up paths
sys.path.insert(0, os.path.dirname(__file__))

# Import the WSGI application
from disilia_core.wsgi import application

# For Namecheap/cPanel Python App, the application object must be named 'application'
# The following is a fallback to ensure it works with Phusion Passenger
def application(environ, start_response):
    from disilia_core.wsgi import application as _app
    return _app(environ, start_response)
