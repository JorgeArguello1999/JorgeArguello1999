# Flask package
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import Flask

# Configs
from config import config

# Routes
from app.routes.main import main

# DB config
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name='dev'):
    app = Flask(__name__)
    
    # Config's starts
    app.config.from_object(config[config_name])

    # Start DB
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register Blueprints
    app.register_blueprint(main)
    
    return app