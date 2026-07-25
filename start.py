'''coderadi &bull; Run file for the Project.'''

# ? IMPORTS
from main import server

# ! RUN THE SERVER
if (__name__ == "__main__"):
    server.run(debug=True, host='0.0.0.0')