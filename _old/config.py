from dotenv import load_dotenv
import os 
load_dotenv()

# HTTPs forzed 
PREFERRED_URL_SCHEME = 'https'

class Config:
    # For develop
    SQLALCHEMY_DATABASE_URI ='sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DB_URL')

config = {
    'dev': Config,
    'pro': ProductionConfig,
}