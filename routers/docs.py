'''coderadi &bull; App navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, abort, current_app
import os
from plugins import *
from models import *

# ! INITIALIZATION
docs = Blueprint("docs", __name__, url_prefix='/docs')

# & MAIN ROUTE
@docs.route('/')
def main():
    return render_template('docs/main.html')

# & OVERVIEW ROUTE
@docs.route('/overview/')
def overview():
    return render_template('docs/overview.html')

# & SHORTCUTS ROUTE
@docs.route('/shortcuts/')
def shortcuts():
    return render_template('docs/shortcuts.html')

# & CONCEPTS ROUTE
@docs.route('/concepts/<concept>')
def concepts(concept):
    path = os.path.join(current_app.root_path, 'templates/docs', f"{concept}.html")
    if (os.path.exists(path)):
        return render_template(f"docs/{concept}.html")
    
    abort(404)