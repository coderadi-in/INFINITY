'''coderadi &bull; Services navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request

# ! INITIALIZATIONS
services = Blueprint("services", __name__)
