'''coderadi &bull; Routes management file for the Project.'''

# ? IMPORTS
from .app import app
from .auth import auth
from .clients import clients
from .services import services


def bind_routers(server):
    """
    Register all route blueprints on the Flask server.

    :param server: The server object.
    """

    server.register_blueprint(app)
    server.register_blueprint(auth)
    server.register_blueprint(clients)
    server.register_blueprint(services)
