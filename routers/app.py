'''coderadi &bull; App navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request

# ! INITIALIZATION
app = Blueprint("app", __name__)
