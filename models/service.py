"""Service database model."""

# ? IMPORTS
from plugins import db

# ! INITIALIZATION
class Service(db.Model):
    """Represents a service or retainer provided to a client.

    Params:
        id (int): Primary key for the service record.
        client_id (int): Foreign key referencing `client.id`.
        title (str): Service title or short label.
        type (str): Service type, either "recurring" or "one_time".
        amount (Decimal): Billed amount for this service.
        billing_cycle (str | None): Optional cycle, "monthly" or "yearly".
        next_renewal_date (date | None): Optional next renewal date.
        last_paid_date (date | None): Optional latest paid date.
        status (str): Current state ("active", "overdue", or "completed").
        created_at (datetime): Timestamp when the service was created.
    """

    __tablename__ = "service"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    billing_cycle = db.Column(db.String(20))
    next_renewal_date = db.Column(db.Date)
    last_paid_date = db.Column(db.Date)
    status = db.Column(db.String(20), nullable=False, default="active")
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    payments = db.relationship("Payment", backref="service", lazy=True, cascade="all, delete-orphan")
