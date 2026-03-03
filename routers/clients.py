'''coderadi &bull; Clients navigation routes management file for the Project.'''

# ? IMPORTS
from datetime import date
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *
from models import *

# ! INITIALIZATIONS
clients = Blueprint("clients", __name__, url_prefix='/clients')

# & ALL CLIENTS ROUTE
@clients.route('/')
@login_required
def all_clients():
    return render_template('clients/clients.html', data={
        'clients': current_user.clients
    })

# & CLIENT INFO ROUTE
@clients.route('/<client>/')
@login_required
def specific_client(client):
    # FETCH DATABASE DATA
    client_obj = Client.query.get(client)

    # VALIDATION
    if (not client_obj):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('clients.all_clients'))
    
    if (client_obj.user_id != current_user.id):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('clients.all_clients'))

    # PAYMENT SUMMARY
    total_bill = db.session.query(
        db.func.coalesce(db.func.sum(Service.amount), 0)
    ).filter(
        Service.client_id == client_obj.id,
        Service.is_deleted == False,
        Service.status == "active"
    ).scalar()

    next_bill = db.session.query(
        db.func.min(Service.next_renewal_date)
    ).filter(
        Service.client_id == client_obj.id,
        Service.is_deleted == False,
        Service.status == "active",
        Service.next_renewal_date >= date.today()
    ).scalar()

    if (not next_bill):
        next_bill = "N/A"

    transactions = Payment.query.join(Service).filter(
        Service.client_id == client_obj.id,
        Service.is_deleted == False,
        Payment.is_deleted == False
    ).order_by(
        Payment.paid_on.desc(),
        Payment.created_at.desc()
    ).all()
    
    # RETURN CLIENT INFO PAGE
    return render_template('clients/client.html', data={
        'client': client_obj,
        'services': client_obj.services,

        'payments': {
            'total_bill': total_bill,
            'next_bill': next_bill
        },
        'transactions': transactions
    })

# & UPDATE CLIENT ROUTE
@clients.route('/<client>/update', methods=['POST'])
@login_required
def update_client(client):
    # FETCH DATABASE DATA
    client_obj = Client.query.get(client)

    # VALIDATION
    if (not client_obj):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('clients.all_clients'))
    
    if (client_obj.user_id != current_user.id):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('clients.all_clients'))

    # ACCESS FOR DATA
    name = request.form.get('name', client_obj.name)
    email = request.form.get('email', client_obj.email)
    phone = request.form.get('phone', client_obj.phone)
    status = request.form.get('status', client_obj.status)
    notes = request.form.get('notes', client_obj.notes)

    # SAVE DATA TO DATABASE
    client_obj.name = name
    client_obj.email = email
    client_obj.phone = phone
    client_obj.status = status
    client_obj.notes = notes

    # UPDATE DATABASE & REDIRECT
    db.session.commit()
    flash("The client info has been changed.", "check_circle")
    return redirect(url_for('clients.specific_client', client=client))

# & NEW CLIENT ROUTE
@clients.route('/new', methods=['POST'])
@login_required
def new_client():
    # ACCESS FORM DATA
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    notes = request.form.get('notes')

    # VALIDATION
    if (
        (not name) or
        (not email)
    ):
        flash("The provided client info isn't valid", "error")
        return redirect(url_for('clients.all_clients'))
    
    # CREATE NEW CLIENT
    new_client_obj = Client(
        user_id=current_user.id,
        name=name,
        email=email,
        phone=phone,
        notes=notes
    )

    # SAVE NEW CLIENT TO DATABASE
    db.session.add(new_client_obj)
    db.session.commit()

    # REDIRECT USER
    flash("The new client info has been saved.", "check_circle")
    return redirect(url_for('clients.specific_client', client=new_client_obj.id))

# & DELETE CLIENT ROUTE
@clients.route('/<client>/delete', methods=['POST'])
@login_required
def delete_client(client):
    # ACCESS FORM DATA
    password_input = request.form.get('password')

    # USER VALIDATION
    if (not bcrypt.check_password_hash(current_user.password, password_input)):
        flash("The provided password isn't hashed with this INFINITY account.", "error")
        return redirect(url_for('clients.specific_client', client=client))

    # FETCH DATABASE DATA
    client_obj = Client.query.get(client)

    # VALIDATION
    if (not client_obj):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('clients.all_clients'))
    
    if (client_obj.user_id != current_user.id):
        flash("There is not client integrated to this INFINITY account.", "error")
        return redirect(url_for('clients.all_clients'))

    # ARCHIVE CLIENT
    client_obj.is_deleted = True

    # ARCHIVE RELATED SERVICES
    services_obj = Service.query.filter_by(client_id=client_obj.id).all()
    for service_obj in services_obj:
        service_obj.is_deleted = True

    # ARCHIVE RELATED PAYMENTS
    services_ids = [service_obj.id for service_obj in services_obj]
    if services_ids:
        payments_obj = Payment.query.filter(Payment.service_id.in_(services_ids)).all()
        for payment_obj in payments_obj:
            payment_obj.is_deleted = True

    # UPDATE DATABASE & REDIRECT
    db.session.commit()
    flash("The client and related records have been archived.", "check_circle")
    return redirect(url_for('clients.all_clients'))
