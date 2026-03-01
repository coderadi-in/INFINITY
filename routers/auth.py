'''coderadi &bull; Authorization routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request

# ! INITIALIZATION
auth = Blueprint("auth", __name__)
