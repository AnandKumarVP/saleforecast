# python -m flask run --debug

import os
import time


from flask import Flask, request, jsonify

from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": ["http://localhost:4200"]}})


# Create a folder uploads
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


from flask_pymongo import PyMongo

app.config['MONGO_URI'] = 'mongodb://localhost:27017/saleforecasting_user_details'
mongo = PyMongo(app)

class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

        
from flask import request, jsonify
from werkzeug.security import generate_password_hash

@app.route('/api/register', methods=['POST'])
def register():
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')
    existing_user = mongo.db.users.find_one({'username': username})
    existing_email= mongo.db.users.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'User Name already exists'})
    if existing_email:
        return jsonify({'message': 'User Email already exists'})
    password_hash = generate_password_hash(password)
    
    new_user = {'username': username, 'email': email, 'password': password_hash}
    mongo.db.users.insert_one(new_user)
    return jsonify({'message': 'User created successfully'})

from flask import session
from werkzeug.security import check_password_hash

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = mongo.db.users.find_one({'username': username})
    user = mongo.db.users.find_one({'email': username})
    
    if not user:  
        return jsonify({'message': 'Invalid username or password'})
    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid username or password'})
    #session['username'] = username
    print(user)
    return jsonify({'message': 'Logged in successfully','username': user['username']})


from pymongo import MongoClient
from gridfs import GridFS

client = MongoClient('mongodb://localhost:27017/')
db1 = client['uploaddata']
fs = GridFS(db1)



@app.route('/api/upload', methods=['POST'])
def upload():
        
    # Get the file from the request
    file=request.files['file']
    periodicity=request.form['periodicity']
    duration=request.form['duration']
    
    # #this line allows to upload many files with timestamp
    # filename=f"{int(time.time())}_{file.filename}" 
    # #this line saves the file into the uploads folder
    # file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
    # #angular's console will be logged with upload successful! msg
   
    # Save the file to GridFS
    file.save('./uploads/' + 'world_population.csv')
    file_id = fs.put(file, filename=file.filename)
    # return str(file_id)
    return jsonify({'message':str(file_id)})


from flask import send_file

@app.route('/api/download')
def download_file():
    path = "./uploads/world_population.csv" # Replace with the path to the file you want to download
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