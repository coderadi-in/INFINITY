'''coderadi &bull; Services navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *
from models import *

# ! INITIALIZATIONS
services = Blueprint("services", __name__, url_prefix='/services')

# & ALL SERVICES ROUTE
@services.route('/')
@login_required
def all_services():
    return render_template('services/all_services.html')

# & SPECIFIC SERVICE ROUTE
@services.route('/<service>/')
@login_required
def specific_service(service):
    # FETCH DATABASE DATA
    service_obj = Service.query.get(service)

    # VALIDATION
    if (not service_obj):
        flash("There is not service integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))
    
    if (service_obj.client.user_id != current_user.id):
        flash("There is not service integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))
    
    # RETURN SERVICE INFO PAGE
    return render_template('services/service.html', data={
        'service': service_obj
    })

# & UPDATE SERVICE ROUTE
@services.route('/<service>/update', methods=['PUT'])
@login_required
def update_service(service):
    # FETCH DATABASE DATA
    service_obj = Service.query.get(service)

    # VALIDATION
    if (not service_obj):
        flash("There is not service integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))
    
    if (service_obj.client.user_id != current_user.id):
        flash("There is not service integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))
    
    # ACCESS FOR DATA
    title = request.form.get('title', service_obj.title)
    type = request.form.get('type', service_obj.type)
    amount = request.form.get('amount', service_obj.amount)
    billing_cycle = request.form.get('billing_cycle', service_obj.billing_cycle)
    next_renewal_date = request.form.get('next_renewal_date', service_obj.next_renewal_date)
    last_paid_date = request.form.get('last_paid_date', service_obj.last_paid_date)
    status = request.form.get('status', service_obj.status)

    # SAVE DATA TO DATABASE
    service_obj.title = title
    service_obj.type = type
    service_obj.amount = amount
    service_obj.billing_cycle = billing_cycle
    service_obj.next_renewal_date = next_renewal_date
    service_obj.last_paid_date = last_paid_date
    service_obj.status = status

    # UPDATE DATABASE & REDIRECT
    db.session.commit()
    flash("The service info has been changed.", "check_circle")
    return redirect(url_for('services.specific_service', service=service))

# & NEW SERVICE ROUTE
@services.route('/new', methods=['POST'])
@login_required
def new_service():
    # ACCESS FORM DATA
    client_id = request.form.get('client')
    title = request.form.get('title')
    type = request.form.get('type')
    amount = request.form.get('amount')
    billing_cycle = request.form.get('billing_cycle')
    next_renewal_date = request.form.get('next_renewal_date')
    last_paid_date = request.form.get('last_paid_date')
    status = request.form.get('status', 'active')

    # VALIDATION
    if (
        (not client_id) or
        (not title) or
        (not type) or
        (not amount)
    ):
        flash("The provided service info isn't valid", "error")
        return redirect(url_for('services.all_services'))
    
    client_obj = Client.query.get(client_id)
    if (not client_obj):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))
    
    if (client_obj.user_id != current_user.id):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))
    
    # CREATE NEW SERVICE
    new_service_obj = Service(
        client_id=client_obj.id,
        title=title,
        type=type,
        amount=amount,
        billing_cycle=billing_cycle,
        next_renewal_date=next_renewal_date,
        last_paid_date=last_paid_date,
        status=status
    )

    # SAVE NEW SERVICE TO DATABASE
    db.session.add(new_service_obj)
    db.session.commit()

    # REDIRECT USER
    flash("The new service info has been saved.", "check_circle")
    return redirect(url_for('services.specific_service', service=new_service_obj.id))

# & DELETE SERVICE ROUTE
@services.route('/<service>/delete', methods=['DELETE'])
@login_required
def delete_service(service):
    # FETCH DATABASE DATA
    service_obj = Service.query.get(service)

    # VALIDATION
    if (not service_obj):
        flash("There is not service integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))
    
    if (service_obj.client.user_id != current_user.id):
        flash("There is not service integrated to this INFINITY account.", "error")
        return redirect(url_for('services.all_services'))

    # ARCHIVE SERVICE
    service_obj.is_deleted = True

    # ARCHIVE RELATED PAYMENTS
    payments_obj = Payment.query.filter_by(service_id=service_obj.id).all()
    for payment_obj in payments_obj:
        payment_obj.is_deleted = True

    # UPDATE DATABASE & REDIRECT
    db.session.commit()
    flash("The service and related payments have been archived.", "check_circle")
    return redirect(url_for('services.all_services'))
