from flask import Flask
from flask import request
import certifi
import datetime
from datetime import timedelta
import csv
import os
from flask_cors import CORS

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
db_client = None
CORS(app)

@app.route("/create_user", methods=['POST'])
def create_user():
    db = get_db()
    user_data = request.get_json()

    first_name = user_data["first_name"]
    last_name = user_data["last_name"]
    username = user_data["username"]
    password = user_data["password"]
    if db["users"].find_one({"username": username}) is not None:
        return {"success": False, "message": "Username already in use"}
    inserted = db["users"].insert_one({"first_name": first_name, "last_name": last_name,
                                       "username": username, "password": password})
    return {"success": True, "user_id": str(inserted.inserted_id)}

@app.route("/login", methods=['POST'])
def login():
    db = get_db()
    user_data = request.get_json()
    username = user_data["username"]
    password = user_data["password"]

    user = db["users"].find_one({"username": username})
    if user is None:
        return {"success": False, "message": "Invalid username"}
    if user["password"] != password:
        return {"success": False, "message": "Invalid password"}

    return {"success": True, "user_id": str(user["_id"])}

@app.route("/new_expense", methods=['POST'])
def new_expense():
    db = get_db()
    expense_data = request.get_json()
    user_id = expense_data["user_id"]
    name = expense_data["name"]
    cost = expense_data["cost"]
    parsed_date = expense_data["date"].split("-")
    date = datetime.datetime(int(parsed_date[0]), int(parsed_date[1]), int(parsed_date[2]), 0, 0, 0)
    category = get_category(name)
    result = db["expenses"].insert_one({"user_id": user_id, "name": name, "cost": cost, "date": date, "category": category})

    if result.acknowledged:
        return {"success": True}
    return {"success": False}

@app.route("/new_expenses", methods=['POST'])
def new_expenses():
    db = get_db()

    user_id = request.form['user_id']
    uploaded_file = request.files['file']
    filepath = os.path.join("uploaded_files", uploaded_file.filename)
    uploaded_file.save(filepath)

    data = []
    names = []
    with open(filepath, 'r', encoding='utf-8-sig') as file:
        csv_file = csv.reader(file)
        for row in csv_file:
            parsed_date = row[2].split("-")
            date = datetime.datetime(int(parsed_date[0]), int(parsed_date[1]), int(parsed_date[2]), 0, 0, 0)
            data.append({"name": row[0], "cost": int(row[1]), "date": date, "user_id": user_id})
            names.append(row[0])
        print(data)
    os.remove(filepath)

    categories = get_category_list(names)
    for i in range(len(data)):
        data[i]["category"] = categories[i]

    if data:
        result = db["expenses"].insert_many(data)
        if result.acknowledged:
            return {"success": True}
    return {"success": False}

@app.route("/category_costs", methods=['POST'])
def category_costs():
    db = get_db()

    expense_data = request.get_json()
    user_id = expense_data["user_id"]

    days = expense_data.get("days", 365000)
    end_date = datetime.datetime.now()
    start_date = end_date - timedelta(days=days)

    pipeline = [
        {
            '$match': {
                'user_id': user_id,
                'date': {'$gte': start_date, '$lte': end_date}
            }
        },
        {
            '$group': {
                '_id': '$category',
                'total_cost': {'$sum': '$cost'}
            }
        }
    ]

    result = list(db["expenses"].aggregate(pipeline))

    formatted_result = []
    for i in range(len(result)):
        formatted_result.append({"label": result[i]["_id"], "value": result[i]["total_cost"], "id": i})

    return {"data": formatted_result}

@app.route("/get_expenses", methods=['POST'])
def get_expenses():
    db = get_db()

    expense_data = request.get_json()
    user_id = expense_data["user_id"]

    result = list(db["expenses"].find({"user_id": user_id}).sort("date"))
    for dict in result:
        del dict['_id']
        del dict['user_id']
    return {"data": result}


def get_category(name):
    return "Food"

def get_category_list(names):
    list = []
    for name in names:
        list.append("Shopping")
    return list

def get_db():
    global db_client
    if not db_client:
        uri = "mongodb+srv://sbjain:OXALjd8aL4Z8OhtM@pfindb.2a6otno.mongodb.net/?retryWrites=true&w=majority"
        db_client = MongoClient(uri, tlsCAFile=certifi.where())
    return db_client.pfin_db

# def new_stock():
#     db = get_db()
#     expense_data = request.get_json()
#     user_id = expense_data["user_id"]
#     parsed_date = expense_data["date"].split("-")
#     parsed_time = expense_data.get("time", "00:00").split(":")
#     date = datetime.datetime(int(parsed_date[0]), int(parsed_date[1]), int(parsed_date[2]),
#                              int(parsed_time[0]), int(parsed_time[1]), 0)
#     result = db["stocks"].insert_one({"user_id": user_id, "name": name, "cost": cost, "date": date, "category": category})

#     if result.acknowledged:
#         return {"success": True}
#     return {"success": False}

# def new_stocks():



