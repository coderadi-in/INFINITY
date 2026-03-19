'''coderadi &bull; App navigation routes management file for the Project.'''

# ? IMPORTS
from datetime import datetime, date
from flask import Blueprint, render_template, redirect, url_for, flash, request
from sqlalchemy.orm import joinedload
from plugins import *
from models import *

# ! INITIALIZATION
app = Blueprint("app", __name__)

# | USER LOADER
@logger.user_loader
def load_user(user):
    return User.query.get(user)

# & INDEX ROUTE
@app.route('/')
def index():
    if (current_user.is_authenticated):
        return redirect(url_for('app.dashboard'))

    return render_template('.index.html')

# & DASHBOARD ROUTE
@app.route('/dashboard/')
@login_required
def dashboard():
    this_year = datetime.now().year
    # GET ALL ACTIVE CLIENTS & TOTAL REVENUE
    active_clients = []
    revenue_list = []
    for client in current_user.clients:
        if (client.status == 'active') and (client.created_at.year == this_year):
            active_clients.append(client)

        for service in client.services:
            for payment in service.payments:
                revenue_list.append(payment.amount)
    
    # GET TOTAL EXPENSE
    expense_list = []
    for expense in current_user.expenses:
        expense_list.append(expense.amount)
    
    # RETURN RESPONSE
    return render_template('pages/dashboard.html', data={
        'total_active_clients': len(active_clients),
        'total_revenue': sum(revenue_list),
        'total_expense': sum(expense_list),
    })

# & NUMBERS ROUTE
@app.route('/numbers/')
@login_required
def numbers():
    # FETCH ALL PAYMENTS
    payments_obj_list = Payment.query.join(Service).join(Client).options(
        joinedload(Payment.service).joinedload(Service.client)
    ).filter(
        Client.user_id == current_user.id,
        Client.is_deleted == False,
        Service.is_deleted == False,
        Payment.is_deleted == False
    ).order_by(
        db.func.coalesce(Payment.paid_on, Payment.created_at).desc(),
        Payment.created_at.desc()
    ).all()

    # FETCH ALL EXPENSES
    expenses_obj_list = Expense.query.filter(
        Expense.user_id == current_user.id,
        Expense.is_deleted == False
    ).order_by(
        db.func.coalesce(Expense.paid_on, Expense.created_at).desc(),
        Expense.created_at.desc()
    ).all()

    # BUILD PAYMENT/EXPENSE TRANSACTION LISTS + REVENUE METRICS IN SINGLE PASSES.
    # Keeping independent lists enables fast filtering by type later, while merge stays O(n + m).
    payment_transactions = []
    expense_transactions = []

    today_date = date.today()
    total_revenue_amount = 0.0
    month_to_date_amount = 0.0
    first_payment_date = None
    latest_payment_date = None

    for payment_obj in payments_obj_list:
        payment_date = payment_obj.paid_on or payment_obj.created_at
        payment_amount = float(payment_obj.amount)

        total_revenue_amount += payment_amount
        if (
            payment_date and
            payment_date.year == today_date.year and
            payment_date.month == today_date.month
        ):
            month_to_date_amount += payment_amount

        if (payment_date):
            if (not first_payment_date) or (payment_date < first_payment_date):
                first_payment_date = payment_date
            if (not latest_payment_date) or (payment_date > latest_payment_date):
                latest_payment_date = payment_date

        client_name = payment_obj.service.client.name if (payment_obj.service and payment_obj.service.client) else "Unknown client"
        service_title = payment_obj.service.title if (payment_obj.service) else "Unknown service"
        payment_transactions.append({
            'symbol': 'call_received',
            'type': 'payment',
            'date': payment_obj.paid_on,
            'amount': payment_obj.amount,
            'notes': f"{client_name} | {service_title}",
            'created_at': payment_obj.created_at,
        })

    # Normalize expenses in one pass.
    for expense_obj in expenses_obj_list:
        expense_transactions.append({
            'symbol': 'call_made',
            'type': 'expense',
            'date': expense_obj.paid_on,
            'amount': expense_obj.amount,
            'notes': expense_obj.category or "",
            'created_at': expense_obj.created_at,
        })

    # MERGE TWO ALREADY-SORTED LISTS IN LINEAR TIME.
    def tx_key(tx):
        tx_date = tx['date'] or tx['created_at']
        return (tx_date, tx['created_at'])

    transactions_obj_list = []
    payment_idx = 0
    expense_idx = 0

    while (
        payment_idx < len(payment_transactions) and
        expense_idx < len(expense_transactions)
    ):
        if (tx_key(payment_transactions[payment_idx]) >= tx_key(expense_transactions[expense_idx])):
            transactions_obj_list.append(payment_transactions[payment_idx])
            payment_idx += 1
        else:
            transactions_obj_list.append(expense_transactions[expense_idx])
            expense_idx += 1

    if (payment_idx < len(payment_transactions)):
        transactions_obj_list.extend(payment_transactions[payment_idx:])

    if (expense_idx < len(expense_transactions)):
        transactions_obj_list.extend(expense_transactions[expense_idx:])

    # REVENUE METRICS
    if (first_payment_date and latest_payment_date):
        active_months = ((latest_payment_date.year - first_payment_date.year) * 12) + (
            latest_payment_date.month - first_payment_date.month
        ) + 1
    else:
        active_months = 1

    average_revenue_per_month_amount = total_revenue_amount / active_months

    # Strong-formatted strings with rupee HTML decimal code.
    total_revenue_display = f"{total_revenue_amount:,.2f}"
    month_to_date_display = f"{month_to_date_amount:,.2f}"
    avg_revenue_display = f"{average_revenue_per_month_amount:,.2f}/M"

    # RETURN OUTPUT
    return render_template('pages/numbers.html', data={
        'transactions': transactions_obj_list,
        'insights': {
            'total_revenue': total_revenue_display,
            'month_to_date': month_to_date_display,
            'avg_revenue': avg_revenue_display,
        },
    })

# & SETTINGS ROUTE
@app.route('/settings/')
@login_required
def settings():
    return render_template('pages/settings.html')

# & ACCOUNT ROUTE
@app.route('/account/', methods=['GET', 'POST'])
@login_required
def account():
    if (request.method == 'GET'):
        # VARIABLES DECLARATION
        # Keep all account metrics scoped to the current calendar year.
        today_date = date.today()
        current_year_start = date(today_date.year, 1, 1)
        total_revenue = 0.0
        total_expense = 0.0
        total_clients = Client.query.filter(
            Client.user_id == current_user.id,
            Client.is_deleted == False,
            Client.created_at >= current_year_start
        ).count()

        # FETCH PAYMENTS FROM DB
        payments_obj_list = Payment.query.join(Service).join(Client).options(
            joinedload(Payment.service).joinedload(Service.client)
        ).filter(
            Client.user_id == current_user.id,
            Client.is_deleted == False,
            Service.is_deleted == False,
            Payment.is_deleted == False,
            db.func.coalesce(Payment.paid_on, Payment.created_at) >= current_year_start
        ).all()

        # FETCH EXPENSES FROM DB
        expense_obj_list = Expense.query.filter_by(
            user_id=current_user.id,
            is_deleted=False
        ).filter(
            db.func.coalesce(Expense.paid_on, Expense.created_at) >= current_year_start
        ).all()

        # CALCULATE TOTAL REVENUE
        for payment_obj in payments_obj_list:
            total_revenue += float(payment_obj.amount)

        # CALCULATE TOTAL EXPENSE
        for expense_obj in expense_obj_list:
            total_expense += float(expense_obj.amount)

        return render_template('pages/account.html', data={
            'total_clients': total_clients,
            'total_revenue': total_revenue,
            'total_expense': total_expense
        })

    # ACCESS FORM DATA
    name = request.form.get('name')
    email = request.form.get('email')

    # UPDATE DATA
    current_user.name = name
    current_user.email = email

    # SAVE & REDIRECT
    db.session.commit()
    flash("The account info has been updated.", "check_circle")
    return redirect(url_for('app.account'))

# ==================================================
# TRASH
# ==================================================

# & TRASH ROUTE
@app.route('/trash/')
def trash():
    # FETCH ALL DELETED CLIENTS
    deleted_clients = Client.query.filter(
        Client.user_id == current_user.id,
        Client.is_deleted == True
    ).order_by(
        Client.created_at.desc()
    ).all()

    # FETCH ALL DELETED SERVICES
    deleted_services = Service.query.join(Client).options(
        joinedload(Service.client)
    ).filter(
        Client.user_id == current_user.id,
        Service.is_deleted == True
    ).order_by(
        Service.created_at.desc()
    ).all()

    # FETCH ALL DELETED PAYMENTS
    deleted_payments = Payment.query.join(Service).join(Client).options(
        joinedload(Payment.service).joinedload(Service.client)
    ).filter(
        Client.user_id == current_user.id,
        Payment.is_deleted == True
    ).order_by(
        db.func.coalesce(Payment.paid_on, Payment.created_at).desc(),
        Payment.created_at.desc()
    ).all()

    # FETCH ALL DELETED EXPENSES
    deleted_expenses = Expense.query.filter(
        Expense.user_id == current_user.id,
        Expense.is_deleted == True
    ).order_by(
        db.func.coalesce(Expense.paid_on, Expense.created_at).desc(),
        Expense.created_at.desc()
    ).all()

    trash_obj = {
        'clients': deleted_clients,
        'services': deleted_services,
        'payments': deleted_payments,
        'expenses': deleted_expenses,
    }

    return render_template('pages/trash.html', data=trash_obj)

# | RESTORE ROUTE
@app.route('/trash/restore/')
def restore_data():
    # ACCESS PROTOCOL DATA
    proto_obj = request.args.get('object')
    proto_id = request.args.get('id')

    # PROTOCOL VALIDATION
    if (not proto_obj) or (not proto_id):
        return redirect(url_for('app.trash'))
    
    # PREPARE DB TABLES
    tables_dict = {
        table.__tablename__: table
        for table in db.Model.__subclasses__()
        if hasattr(table, '__tablename__')
    }
    

    target_object = tables_dict.get(proto_obj)
    if (not target_object):
        return redirect(url_for('app.trash'))
    
    target_row = target_object.query.get(proto_id)
    if (not target_row):
        return redirect(url_for('app.trash'))
    
    target_row.is_deleted = False
    db.session.commit()

    flash("The deleted object has been restored.", "check_circle")
    return redirect(url_for('app.trash'))