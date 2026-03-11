'''coderadi &bull; App navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *
from models import *

# ! INITIALIZATION
docs = Blueprint("docs", __name__, url_prefix='/docs')

# & MAIN ROUTE
@docs.route('/')
def main():
    return render_template('docs/main.html')