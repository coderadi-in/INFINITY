'''coderadi &bull; Clients navigation routes management file for the Project.'''

# ==================================================
# INITIALIZATION
# ==================================================

# ? IMPORTS
from datetime import date
from flask import Blueprint, render_template, redirect, url_for, flash, request, Response
from plugins import *
from models import *

# ! INITIALIZATIONS
clients = Blueprint("clients", __name__, url_prefix='/clients')

# ==================================================
# FUNCTIONS
# ==================================================

# * FUNCTION TO CHECK IF CLIENT OBJ IS INTEGRATE TO CURRENT USER
def validated_client(client_obj) -> bool:
    if (
        (not client_obj) or
        (client_obj.user_id != current_user.id)
    ):
        False
    
    return True

# ==================================================
# CLIENTS MANAGEMENT ROUTES
# ==================================================

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
    # CLIENT VALIDATION
    client_obj = Client.query.get(client)
    if (not validated_client(client_obj)):
        flash("There's not client integrated to this INFINITY account.")
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
    # CLIENT VALIDATION
    client_obj = Client.query.get(client)
    if (not validated_client(client_obj)):
        flash("There's not client integrated to this INFINITY account.")
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
    # CLIENT VALIDATION
    client_obj = Client.query.get(client)
    if (not validated_client(client_obj)):
        flash("There's not client integrated to this INFINITY account.")
        return redirect(url_for('clients.all_clients'))

    # ACCESS FORM DATA
    password_input = request.form.get('password')

    # USER VALIDATION
    if (not bcrypt.check_password_hash(current_user.password, password_input)):
        flash("The provided password isn't hashed with this INFINITY account.", "error")
        return redirect(url_for('clients.specific_client', client=client))

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

# ==================================================
# CLIENT SERVICES MANAGEMENT ROUTES
# ==================================================

# & ALL SERVICES ROUTE
@clients.route('/<client>/services/')
def all_services(client):
    # CLIENT VALIDATION
    client_obj = Client.query.get(client)
    if (not validated_client(client_obj)):
        flash("There's not client integrated to this INFINITY account.")
        return redirect(url_for('clients.all_clients'))
    
    # FETCH SERVICES DATA
    service_obj_list = Service.query.filter_by(client_id=client).all()

    # RETURN RESPONSE
    return render_template('clients/services.html', data={
        'client': client_obj,
        'services': service_obj_list,
    })

# & NEW SERVICE ROUTE
@clients.route('/<client>/services/new', methods=['POST'])
def new_service(client):
    # CLIENT VALIDATION
    client_obj = Client.query.get(client)
    if (not validated_client(client_obj)):
        flash("There's not client integrated to this INFINITY account.")
        return redirect(url_for('clients.all_clients'))
    
    # ACCESS FORM DATA
    title = request.form.get('title')
    category = request.form.get('category')
    billing_cycle = request.form.get('billing_cycle')
    amount = request.form.get('amount')

    # VALIDATION
    if (
        (not title) or
        (not category) or
        (not amount)
    ):
        flash("Some of the required inputs aren't provided properly.", "error")
        return redirect(url_for('clients.specific_client', client=client))
    
    # CREATE NEW SERVICE OBJECT
    new_service_obj = Service(
        client_id=client,
        title=title,
        category=category,
        billing_cycle=billing_cycle,
        amount=amount
    )

    # SAVE NEW SERVICE OBJECT
    db.session.add(new_service_obj)
    db.session.commit()

    # REDIRECT USER
    flash("The new service has been saved.", "check_circle")
    return redirect(url_for('clients.specific_client', client=client))

# & UPDATE SERVICE ROUTE
@clients.route('/<client>/services/<service>/update', methods=['POST'])
@login_required
def update_service(client, service):
    # CLIENT VALIDATION
    client_obj = Client.query.get(client)
    if (not validated_client(client_obj)):
        flash("There's not client integrated to this INFINITY account.")
        return redirect(url_for('clients.all_clients'))

    # SERVICE VALIDATION
    service_obj = Service.query.get(service)
    if (
        (not service_obj) or
        (service_obj.client_id != client_obj.id) or
        (service_obj.is_deleted)
    ):
        flash("The selected service isn't valid for this client.", "error")
        return redirect(url_for('clients.specific_client', client=client))

    # ACCESS FORM DATA
    title = request.form.get('title', service_obj.title)
    category = request.form.get('category', service_obj.category)
    billing_cycle = request.form.get('billing_cycle', service_obj.billing_cycle)
    amount = request.form.get('amount', service_obj.amount)

    # VALIDATION
    if (
        (not title) or
        (not category) or
        (not amount)
    ):
        flash("Some of the required inputs aren't provided properly.", "error")
        return redirect(url_for('clients.specific_client', client=client))

    if (category != "recurring"):
        billing_cycle = None

    # SAVE UPDATED DATA
    service_obj.title = title
    service_obj.category = category
    service_obj.billing_cycle = billing_cycle
    service_obj.amount = amount

    # UPDATE DATABASE & REDIRECT
    db.session.commit()
    flash("The service info has been changed.", "check_circle")
    return redirect(url_for('clients.specific_client', client=client))

# & DELETE SERVICE ROUTE
@clients.route('/<client>/services/<service>/delete')
@login_required
def delete_service(client, service):
    # CLIENT VALIDATION
    client_obj = Client.query.get(client)
    if (not validated_client(client_obj)):
        flash("There's not client integrated to this INFINITY account.")
        return redirect(url_for('clients.all_clients'))

    # SERVICE VALIDATION
    service_obj = Service.query.get(service)
    if (
        (not service_obj) or
        (service_obj.client_id != client_obj.id) or
        (service_obj.is_deleted)
    ):
        flash("The selected service isn't valid for this client.", "error")
        return redirect(url_for('clients.specific_client', client=client))

    # ARCHIVE SERVICE
    service_obj.is_deleted = True

    # ARCHIVE RELATED PAYMENTS
    payments_obj = Payment.query.filter_by(service_id=service_obj.id).all()
    for payment_obj in payments_obj:
        payment_obj.is_deleted = True

    # UPDATE DATABASE & REDIRECT
    db.session.commit()
    flash("The service and related payments have been archived.", "check_circle")
    return redirect(url_for('clients.specific_client', client=client))
