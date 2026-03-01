"""User database model."""

# ? IMPORTS
from plugins import db, UserMixin

# ! INITIALIZATION
class User(db.Model, UserMixin):
    """Represents a registered freelancer using the platform.

    Params:
        id (int): Primary key for the user record.
        name (str): Full name of the user.
        email (str): Unique email address used for login.
        password_hash (str): Secure hash of the account password.
        plan_type (str): Subscription plan, either "free" or "pro".
        created_at (datetime): Timestamp when the account was created.
    """

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    plan_type = db.Column(db.String(20), nullable=False, default="free")
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    clients = db.relationship("Client", backref="user", lazy=True, cascade="all, delete-orphan")
