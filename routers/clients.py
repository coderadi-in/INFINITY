'''coderadi &bull; Clients navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request

# ! INITIALIZATIONS
clients = Blueprint("clients", __name__)
