"""Expense database model."""

# ? IMPORTS
from plugins import db

# ! INITIALIZATION
class Expense(db.Model):
    """Represents business expenses incurred by the freelancer.

    Params:
        id (int): Primary key for the expense record.
        user_id (int): Foreign key referencing `user.id`.
        related_server_id (int | None): Optional foreign key referencing `server.id`.
        title (str): Short expense title.
        description (str | None): Optional details about the expense.
        amount (Decimal): Expense amount.
        category (str): Expense category (hosting, domain, software_tools, marketing, other).
        paid_on (date): Date when the expense was paid.
        recurring (bool): Indicates whether this is a recurring expense.
        recurring_cycle (str | None): Recurrence cycle ("monthly" or "yearly") when recurring.
        created_at (datetime): Timestamp when the expense record was created.
    """

    __tablename__ = "expense"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    related_server_id = db.Column(db.Integer, db.ForeignKey("server.id"))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    paid_on = db.Column(db.Date, nullable=False)
    recurring = db.Column(db.Boolean, nullable=False, default=False)
    recurring_cycle = db.Column(db.String(20))
    is_deleted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
