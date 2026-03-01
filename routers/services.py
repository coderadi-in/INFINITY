'''coderadi &bull; Services navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *

# ! INITIALIZATIONS
services = Blueprint("services", __name__)

# & ALL SERVICES ROUTE
@services.route('/')
@login_required
def all_services():
    return render_template('services/all_services.html')

# & SPECIFIC SERVICE ROUTE
@services.route('/<service>/')
@login_required
def specific_service(service):
    pass

# & UPDATE SERVICE ROUTE
@services.route('/<service>/update', methods=['PUT'])
@login_required
def update_service():
    pass

# & NEW SERVICE ROUTE
@services.route('/new', methods=['POST'])
@login_required
def new_service():
    pass

# & DELETE SERVICE ROUTE
@services.route('/<service>/delete', methods=['DELETE'])
@login_required
def delete_service():
    pass
