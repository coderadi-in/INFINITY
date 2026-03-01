"""Payment database model."""

# ? IMPORTS
from plugins import db

# ! INITIALIZATION
class Payment(db.Model):
    """Represents a payment made for a service.

    Params:
        id (int): Primary key for the payment record.
        service_id (int): Foreign key referencing `service.id`.
        amount (Decimal): Amount recorded for the payment.
        paid_on (date | None): Optional date when payment was made.
        method (str | None): Optional payment method label.
        status (str): Payment state, either "paid" or "pending".
        created_at (datetime): Timestamp when the payment was created.
    """

    __tablename__ = "payment"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_id = db.Column(db.Integer, db.ForeignKey("service.id"), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    paid_on = db.Column(db.Date)
    method = db.Column(db.String(100))
    status = db.Column(db.String(20), nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
