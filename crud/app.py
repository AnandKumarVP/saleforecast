# Import necessary libraries
import os
import time

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from gridfs import GridFS
from ml import forecast
from dataconv import convertion


# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:4200"]}})

# Initialize MongoDB
app.config['MONGO_URI'] = 'mongodb://localhost:27017/saleforecasting_user_details'
mongo = PyMongo(app)

# Define User class
class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

# Define register endpoint
@app.route('/api/register', methods=['POST'])
def register():
    # Get data from request
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')

    # Check if user or email already exists
    existing_user = mongo.db.users.find_one({'username': username})
    existing_email= mongo.db.users.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'User Name already exists'})
    if existing_email:
        return jsonify({'message': 'User Email already exists'})

    # Hash password and insert user into MongoDB
    password_hash = generate_password_hash(password)
    new_user = {'username': username, 'email': email, 'password': password_hash}
    mongo.db.users.insert_one(new_user)
    return jsonify({'message': 'User created successfully'})

# Define login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    # Get data from request
    username = request.json.get('username')
    password = request.json.get('password')

    # Check if user exists and password is correct
    user = mongo.db.users.find_one({'username': username})
    user = mongo.db.users.find_one({'email': username}) #TODO: redundant code, check why email is also searched
    if not user:  
        return jsonify({'message': 'Invalid username or password'})
    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid username or password'})

    # Return success message and username
    return jsonify({'message': 'Logged in successfully','username': user['username']})

# Initialize MongoDB client and GridFS
client = MongoClient('mongodb://localhost:27017/')
db1 = client['uploaddata']
fs = GridFS(db1)

# Define upload endpoint
@app.route('/api/upload', methods=['POST'])
def upload():
    # Get file and data from request
    file = request.files['file']
    periodicity = request.form['periodicity']
    duration = request.form['duration']
    freq = 'D'
    if periodicity == "Yearly":
        freq = 'Y'
    elif periodicity == "Monthly":
        freq = 'M'
    elif periodicity == "Weekly":
        freq = 'W'
    else:
        freq = 'D'
    # Save file to GridFS
    file.save('./uploads/' + 'actual_data.csv')
    file_id = fs.put(file, filename=file.filename)

    # Call forecast function and return success message with file id
    if(forecast(duration, freq)==True):
            # return jsonify({'message': str(file_id)})
        convertion()
        response = jsonify({'message': str(file_id)})
    else:
        response = jsonify({'message': 'error'})

    # return jsonify({'message': str(file_id)})
    
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# Define download endpoint
@app.route('/api/download1')
def download_file1():

    path = "./download/grouped_data.csv" # Replace with the path to the file you want to download
    return send_file(path, as_attachment=True)
    
# Define download endpoint
@app.route('/api/download2')
def download_file2():
    path = "./download/predicted_data.csv" # Replace with the path to the file you want to download
    return send_file(path, as_attachment=True)
        

# @app.route('/api/download/')
# def download_file(filename):
#     file = fs.find_one({'filename': filename})
#     if file:
#         return send_file(file, attachment_filename=filename)
#     else:
#         return 'File not found'
    
    

# @app.route('/api/login', methods=['POST'])
# def login():
#     username = request.json.get('username')
#     password = request.json.get('password')
#     if username == 'john' and password == '12345a':
#         return jsonify({'message': 'Login Successful'})
#     else:
#         return jsonify({'message': 'Invalid Username or Password'})   

