"""Client database model."""

# ? IMPORTS
from plugins import db

# ! INITIALIZATION
class Client(db.Model):
    """Represents a client managed by the freelancer.

    Params:
        id (int): Primary key for the client record.
        user_id (int): Foreign key referencing `user.id`.
        name (str): Name of the client.
        email (str | None): Optional client email address.
        phone (str | None): Optional client phone number.
        status (str): Lifecycle state, either "active" or "inactive".
        notes (str | None): Optional notes about the client.
        created_at (datetime): Timestamp when the client was created.
    """

    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    status = db.Column(db.String(20), nullable=False, default="active")
    notes = db.Column(db.Text)
    is_deleted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    services = db.relationship("Service", backref="client", lazy=True, cascade="all, delete-orphan")
