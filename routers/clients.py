'''coderadi &bull; Clients navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *

# ! INITIALIZATIONS
clients = Blueprint("clients", __name__)

# & ALL CLIENTS ROUTE
@clients.route('/')
@login_required
def all_clients():
    return render_template('clients/all_clients.html')

# & SPECIFIC CLIENT ROUTE
@clients.route('/<client>/')
@login_required
def specific_client(client):
    pass

# & UPDATE CLIENT ROUTE
@clients.route('/<client>/update', methods=['PUT'])
@login_required
def update_client():
    pass

# & NEW CLIENT ROUTE
@clients.route('/new', methods=['POST'])
@login_required
def new_client():
    pass

# & DELETE CLIENT ROUTE
@clients.route('/<client>/delete', methods=['DELETE'])
@login_required
def delete_client():
    pass
