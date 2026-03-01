'''coderadi &bull; App navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *

# ! INITIALIZATION
app = Blueprint("app", __name__)

# & INDEX ROUTE
@app.route('/')
def index():
    if (current_user.is_authenticated):
        return redirect(url_for('app.dashboard'))

    return render_template('.index.html')

# & DASHBOARD ROUTE
@app.route('/dashboard/')
@login_required
def dashboard():
    return render_template('pages/dashboard.html')

# & NUMBERS ROUTE
@app.route('/numbers/')
@login_required
def numbers():
    return render_template('pages/numbers.html')

# & INSIGHTS ROUTE
@app.route('/insights/')
@login_required
def insights():
    return render_template('pages/insights.html')

# & SETTINGS ROUTE
@app.route('/settings/')
@login_required
def settings():
    return render_template('pages/settings.html')

# & ACCOUNT ROUTE
@app.route('/account/')
@login_required
def account():
    return render_template('pages/account.html')
