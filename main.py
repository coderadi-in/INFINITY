'''coderadi &bull; Main file for the Project.'''

# ? IMPORTS
from flask import Flask
import os
from plugins import bind_plugins, db
from routers import bind_routers

# ! LOADING VIRTUAL ENVIRONMENT
from dotenv import load_dotenv
load_dotenv('.venv/vars.env')

# ! INITIALIZATIONS
server = Flask(__name__)
server.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
server.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
server.config['SECRET_KEY'] = os.getenv('KEY')

# ! BINDING PLUGINS
bind_plugins(server)
bind_routers(server)

# ! INITIALIZE DATABASE
with (server.app_context()):
    db.create_all()