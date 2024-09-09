from flask import Flask
from app.routes.main import main

def create_app():
    app = Flask(__name__)
    
    # Config's starts
    app.config.from_pyfile('../config.py')
    
    # Register Blueprints
    app.register_blueprint(main)
    
    return app