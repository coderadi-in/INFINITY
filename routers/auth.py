'''coderadi &bull; Authorization routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *
from models import *

# ! INITIALIZATION
auth = Blueprint("auth", __name__, url_prefix='/auth')

# & START ROUTE
@auth.route('/start/')
def start():
    return render_template('auth/start.html')


@auth.route('/signup', methods=['POST'])
def signup():
    # ACCESS FORM DATA
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    
    # VALIDATION
    if (
        (not name) or
        (not email) or 
        (not password)
    ):
        flash("Some inputs aren't provided properly. Please retry again", "error")
        return redirect(url_for('auth.start', _anchor="start"))
    
    new_user = User(name=name, email=email, password=bcrypt.generate_password_hash(password))

    db.session.add(new_user)
    db.session.commit()

    # LOGIN & REDIRECT USER
    login_user(new_user)
    flash("Your INFINITY account has been signed up.", "check_circle")
    return redirect(url_for('app.dashboard'))


@auth.route('/login', methods=['POST'])
def login():
    # ACCESS FORM DATA
    email = request.form.get('email')
    password = request.form.get('password')
    
    # FORM VALIDATION
    if (
        (not email) or 
        (not password)
    ):
        flash("Some inputs aren't provided properly. Please retry again", "error")
        return redirect(url_for('auth.start', _anchor="start"))
    
    # GET LOGGED USER
    logged_user = User.query.filter_by(email=email).first()

    # CREDENTIALS VALIDATION
    if (not logged_user):
        flash("There's no INFINITY account integrated to provided email.", "error")
        return redirect(url_for('auth.start', _anchor="start"))
    
    if (not bcrypt.check_password_hash(logged_user.password, password)):
        flash("The provided password is mismatched from the original INFINITY password.", "error")
        return redirect(url_for('auth.start', _anchor="start"))

    # LOGIN & REDIRECT USER
    login_user(logged_user)
    flash("Your INFINITY account has been logged in.", "check_circle")
    return redirect(url_for('app.dashboard'))


@auth.route('/logout')
def logout():
    logout_user()
    flash("This INFINITY account has been logged out.", "info")
    return redirect(url_for('app.index'))
