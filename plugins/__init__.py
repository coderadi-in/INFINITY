'''coderadi &bull; Plugins management file for the Project.'''

# ? IMPORTS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, migrate
from flask_socketio import SocketIO
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from flask_bcrypt import Bcrypt

# ! INITIALIZATIONS
db = SQLAlchemy()
migrator = Migrate()
socket = SocketIO()
logger = LoginManager()
bcrypt = Bcrypt()

# * FUNCTION TO BIND ALL PLUGINS TO THE SERVER
def bind_plugins(server):
    """Initialize and bind all configured plugins to the Flask server.

    Args:
        server: The Flask application instance receiving plugin bindings.
    """
    db.init_app(server)
    migrator.init_app(server, db)
    socket.init_app(server)
    logger.init_app(server)
    bcrypt.init_app(server)
