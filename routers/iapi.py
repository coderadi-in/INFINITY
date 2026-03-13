'''coderadi &bull; App navigation routes management file for the Project.'''

# ? IMPORTS
from flask import Blueprint, jsonify
from datetime import datetime
from plugins import *
from models import *

# ! INITIALIZATION
iapi = Blueprint("iapi", __name__, url_prefix='/api/internals')

# & TRANSACTIONS ROUTE
@iapi.route('/transactions')
def send_transactions():
    this_year = datetime.now().year
    # CREATE OUTPUT INSTANCE
    expenses_list = []
    payments_list = []
    amounts = []
    dates = []

    # POPULATE EXPENSES LIST
    for expense in current_user.expenses:
        if (not expense.is_deleted) and (expense.paid_on.year == this_year):
            expenses_list.append([expense.amount, expense.paid_on.strftime("%d-%m-%Y")])
    
    # POPULATE PAYMENTS LIST
    for client in current_user.clients:
        if (client.status == 'active') and (not client.is_deleted):
            
            for service in client.services:
                if (not service.is_deleted):

                    for payment in service.payments:
                        if (not payment.is_deleted) and (payment.paid_on.year == this_year):
                            payments_list.append([payment.amount, payment.paid_on.strftime("%d-%m-%Y")])
    
    # SORT LIST
    combined = expenses_list + payments_list
    combined.sort(key=lambda item: item[1], reverse=True)
    for amount, paid_on in combined:
        amounts.append(amount)
        dates.append(paid_on)

    # RETURN RESPONSE
    return jsonify({
        'dates': dates,
        'amounts': amounts
    })