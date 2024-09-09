from flask import Blueprint, render_template
from flask_bcrypt import Bcrypt

# Init encrypt the data
bcrypt = Bcrypt()

# Created a blueprint 
main = Blueprint('main', __name__)

# HomePage
@main.route('/')
def home():
    return render_template('main.html')

# Blog
@main.route('/blog')
def blog():
    return render_template('blog.html')