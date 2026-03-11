'''coderadi &bull; Expenses routes management file for the Project.'''

# ? IMPORTS
from datetime import datetime
from flask import Blueprint, render_template, redirect, url_for, flash, request
from plugins import *
from models import *

# ! INITIALIZATION
expenses = Blueprint("expenses", __name__, url_prefix='/expenses')

# & CREATE ROUTE
@expenses.route('/new', methods=['POST'])
@login_required
def create_expense():
    # ACCESS FORM DATA
    title = request.form.get('title')
    amount = request.form.get('amount')
    category = request.form.get('category')
    paid_on = request.form.get('paid_on')
    desc = request.form.get('desc')
    paid_on_date = datetime.strptime(paid_on, "%Y-%m-%d").date() if paid_on else None

    # VALIDATION
    if (
        (not title) or (not amount) or
        (not category) or (not paid_on)
    ):
        flash("Some required inputs aren't provided properly.", "error")
        return redirect(url_for('expenses.read_expense'))
    
    # CREATE NEW EXPENSE OBJECT
    new_exp_obj = Expense(
        user_id=current_user.id,
        title=title,
        amount=amount,
        category=category,
        paid_on=paid_on_date,
        description=desc
    )

    # SAVE EXPENSE OBJECT
    db.session.add(new_exp_obj)
    db.session.commit()

    # REDIRECT USER
    flash("A new expense has been recorded.", "check_circle")
    return redirect(url_for('expenses.read_expense'))

# & READ ROUTE
@expenses.route('/')
@login_required
def read_expense():
    expenses_list = Expense.query.filter_by(user_id=current_user.id).all()
    return render_template('expenses/expenses.html', data={
        'expenses': expenses_list
    })

# & UPDATE ROUTE
@expenses.route('/<expense>/update', methods=['POST'])
@login_required
def update_expense(expense):
    # ACCESS PROTOCOL DATA
    expense_obj = Expense.query.get(expense)

    # PROTOCOL VALIDATION
    if (not expense_obj) or (expense_obj.user_id != current_user.id):
        flash("The expense with provided details is not integrated to this INFINITY account.", "error")
        return redirect(url_for('expenses.read_expense'))
    
    # ACCESS FORM DATA
    title = request.form.get('title', expense_obj.title)
    amount = request.form.get('amount', expense_obj.amount)
    category = request.form.get('category', expense_obj.category)
    desc = request.form.get('desc', expense_obj.description)
    
    paid_on = request.form.get('paid_on')
    if (not paid_on): paid_on_date = expense_obj.paid_on
    elif (not paid_on.strip()): paid_on_date = None
    else:
        try:
            paid_on_date = datetime.strptime(paid_on, "%Y-%m-%d").date()
        except ValueError:
            flash("Invalid payment date format.", "error")
            return redirect(url_for('expenses.read_expense'))

    # ATTACH DATA TO THE EXPENSE OBJECT
    expense_obj.title = title
    expense_obj.amount = amount
    expense_obj.category = category
    expense_obj.paid_on = paid_on_date
    expense_obj.description = desc

    # SAVE & REDIRECT
    db.session.commit()
    flash("The expense record has been updated.", "check_circle")
    return redirect(url_for('expenses.read_expense'))

# & DELETE ROUTE
@expenses.route('/<expense>/delete')
@login_required
def delete_expense(expense):
    # ACCESS PROTOCOL DATA
    expense_obj = Expense.query.get(expense)

    # PROTOCOL VALIDATION
    if (not expense_obj) or (expense_obj.user_id != current_user.id):
        flash("The expense with provided details is not integrated to this INFINITY account.", "error")
        return redirect(url_for('expenses.read_expense'))
    
    # DELETE OBJECT
    expense_obj.is_deleted = True
    db.session.commit()
    
    # SAVE & REDIRECT
    db.session.commit()
    flash("The expense record has been archived.", "check_circle")
    return redirect(url_for('expenses.read_expense'))