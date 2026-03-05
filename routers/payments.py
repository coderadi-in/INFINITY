'''coderadi &bull; Payments routes management file for the Project.'''

# ? IMPORTS
from datetime import datetime, timedelta
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *
from models import *

# ! INITIALIZATION
payments = Blueprint("payments", __name__, url_prefix='/payments')

# ! CONSTANTS DEFINITION
PAYMENTS_ALIAS = {
    'upi': 'UPI',
    'bank': 'BANK TRANSFER',
    'cash': 'CASH',
    'other': 'OTHER'
}

# & NEW ROUTE
@payments.route('/new/', methods=['POST'])
@login_required
def new_payment():
    # ACCESS PROTOCOL DATA
    client = request.args.get('client')

    # PROTOCOL VALIDATION
    if (not client):
        flash("There's not client integrated to this INFINITY account", "error")
        return redirect(url_for('clients.clients'))

    # ACCESS FORM DATA
    service_id = request.form.get('service_id')
    amount = request.form.get('amount')
    paid_on = request.form.get('paid_on')
    method = PAYMENTS_ALIAS.get(request.form.get('method'), 'OTHER')
    status = request.form.get('status')
    paid_on_date = datetime.strptime(paid_on, "%Y-%m-%d").date() if paid_on else None

    # VALIDATION
    if (
        (not service_id) or
        (not amount) or
        (not status)
    ):
        flash("Some required inputs aren't provided properly.", "error")
        return redirect(url_for('clients.specific_client', client=client))
    
    # ACCESS RELATED SERVICE
    service_obj = Service.query.get(service_id)
    service_obj.last_paid_date = paid_on_date
    service_obj.next_renewal_date = paid_on_date + timedelta(days=30)
    
    # CREATE NEW PAYMENTS ROW
    new_payment_row = Payment(
        service_id=service_id,
        amount=amount,
        paid_on=paid_on_date,
        method=method,
        status=status,
    )

    # SAVE PAYMENTS OBJECT
    db.session.add(new_payment_row)
    db.session.commit()

    # RETURN RESPONSE
    flash("The new payments info has been saved.", "check_circle")
    return redirect(url_for('clients.specific_client', client=client))
