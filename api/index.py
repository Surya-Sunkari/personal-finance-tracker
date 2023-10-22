from flask import Flask
from flask import request
import certifi
import datetime
from datetime import timedelta
import csv
import os
import jwt;
from flask_cors import CORS
import yfinance as yf
import gpt_calls
import ast
from gpt_calls import categorize_single, categorize_multiple, get_recommendation

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import requests
import os

# Define the directory path
directory = "uploaded_files"

# Create the directory if it doesn't exist
if not os.path.exists(directory):
    os.makedirs(directory)

app = Flask(__name__)
db_client = None
CORS(app)
# CORS(app, resources={r"/new_expenses": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/*": {"origins": "*", "methods": ["POST", "OPTIONS"], "allow_headers": "content-type"}})


@app.route("/create_user", methods=['POST'])
def create_user():
    import config
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
    encoded_jwt = jwt.encode({"user_id": str(inserted.inserted_id)}, config.jwt_secret, algorithm="HS256")

    return {"success": True, "token": encoded_jwt}

@app.route("/login", methods=['POST'])
def login():
    import config
    db = get_db()
    user_data = request.get_json()
    username = user_data["username"]
    password = user_data["password"]

    user = db["users"].find_one({"username": username})
    if user is None:
        return {"success": False, "message": "Invalid username"}
    if user["password"] != password:
        return {"success": False, "message": "Invalid password"}
    
    encoded_jwt = jwt.encode({"user_id": str(user["_id"])}, config.jwt_secret, algorithm="HS256")

    return {"success": True, "token": encoded_jwt}

@app.route("/new_expense", methods=['POST'])
def new_expense():
    db = get_db()
    expense_data = request.get_json()
    user_id = expense_data["user_id"]
    name = expense_data["name"]
    cost = expense_data["cost"]
    parsed_date = expense_data["date"].split("-")
    date = datetime.datetime(int(parsed_date[0]), int(parsed_date[1]), int(parsed_date[2]), 0, 0, 0)
    category = categorize_single(name).capitalize()
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
    os.remove(filepath)

    categories = ast.literal_eval(categorize_multiple(names))
    for i in range(len(data)):
        data[i]["category"] = categories[i].capitalize()

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
    i = 0
    for dict in result:
        del dict['_id']
        del dict['user_id']
        dict['id'] = i
        i += 1
    return {"data": result}

@app.route("/get_recommendations", methods=['POST'])
def get_recommendations():
    db = get_db()

    expense_data = request.get_json()
    user_id = expense_data["user_id"]

    expenses = list(db["expenses"].find({"user_id": user_id}).sort("date"))
    result = []
    for expense in expenses:
        expense_result = []
        expense_result.append(expense["name"])
        expense_result.append(expense["category"])
        expense_result.append(float(expense["cost"]))
        expense_result.append(expense["date"].strftime('%B') + " " + expense["date"].strftime('%Y'))
        result.append(expense_result)
    expense_string = "\n".join([f"{item} ({category}): ${price:.2f} - {date}" for item, category, price, date in result])
    return {"data": get_recommendation(expense_string)}


def get_db():
    global db_client
    if not db_client:
        uri = "mongodb+srv://sbjain:OXALjd8aL4Z8OhtM@pfindb.2a6otno.mongodb.net/?retryWrites=true&w=majority"
        db_client = MongoClient(uri, tlsCAFile=certifi.where())
    return db_client.pfin_db

@app.route("/new_stock", methods=['POST'])
def new_stock():
    db = get_db()
    stock_data = request.get_json()
    user_id = stock_data["user_id"]
    ticker = stock_data["ticker"]
    quantity = stock_data["quantity"]

    # check if stock already exists
    stock = db["stocks"].find_one({"user_id": user_id, "ticker": ticker})
    if stock is not None:
        new_amt = stock["quantity"] + quantity
        result = db["stocks"].update_one({"user_id": user_id, "ticker": ticker},
                                         {"$set": {'quantity': new_amt}})
        if result.acknowledged:
            return {"success": True}
        return {"success": False}

    parsed_date = stock_data["date"].split("-")
    parsed_time = stock_data.get("time", "00:00").split(":")
    date = datetime.datetime(int(parsed_date[0]), int(parsed_date[1]), int(parsed_date[2]),
                             int(parsed_time[0]), int(parsed_time[1]), 0)
    result = db["stocks"].insert_one({"user_id": user_id, "ticker": ticker,
                                      "name": get_stock_name(ticker),
                                      "quantity": quantity, "date_bought": date})

    if result.acknowledged:
        return {"success": True}
    return {"success": False}

@app.route("/new_stocks", methods=['POST'])
def new_stocks():
    db = get_db()

    user_id = request.form['user_id']
    uploaded_file = request.files['file']
    filepath = os.path.join("uploaded_files", uploaded_file.filename)
    uploaded_file.save(filepath)

    data = []
    with open(filepath, 'r', encoding='utf-8-sig') as file:
        csv_file = csv.reader(file)
        for row in csv_file:
            ticker = row[0]
            if not ticker:
                continue
            stock = db["stocks"].find_one({"user_id": user_id, "ticker": ticker})
            if stock is not None:
                new_amt = stock["quantity"] + float(row[1])
                db["stocks"].update_one({"user_id": user_id, "ticker": ticker},
                                        {"$set": {'quantity': new_amt}})
                continue
                
            parsed_date = row[2].split("-")
            parsed_time = row[3].split(":")
            date = datetime.datetime(int(parsed_date[0]), int(parsed_date[1]), int(parsed_date[2]),
                                     int(parsed_time[0]), int(parsed_time[1]), 0)
            data.append({"user_id": user_id, "ticker": ticker, "name": get_stock_name(ticker), "quantity": float(row[1]), "date_bought": date})
    os.remove(filepath)

    if data:
        result = db["stocks"].insert_many(data)
        if result.acknowledged:
            return {"success": True}
    return {"success": False}

@app.route("/sell_stock", methods=['POST'])
def sell_stock():
    db = get_db()

    stock_data = request.get_json()
    user_id = stock_data["user_id"]
    ticker = stock_data["ticker"]
    sell_all = stock_data.get("sell_all", False)
    sell_amt = stock_data.get("sell_amt", 0)
    stock = db["stocks"].find_one({"user_id": user_id, "ticker": ticker})
    if stock is None:
        return {"success": False}

    if sell_all:
        db["stocks"].delete_one({"user_id": user_id, "ticker": ticker})
    else:
        new_amt = stock["quantity"] - sell_amt
        if new_amt <= 0:
            db["stocks"].delete_one({"user_id": user_id, "ticker": ticker})
        else:
            db["stocks"].update_one({"user_id": user_id, "ticker": ticker},
                                    {"$set": {'quantity': new_amt}})
    return {"success": True}

@app.route("/stock_news", methods=['POST'])
def stock_news():
    db = get_db()

    stock_data = request.get_json()
    user_id = stock_data["user_id"]
    stocks = db["stocks"].find({"user_id": user_id})

    data = []
    links = []
    for stock in stocks:
        i = 0
        articles = get_stock_news(stock["ticker"])
        article = articles[0]
        while article["link"] in links or (stock["ticker"] not in article["title"] and stock["name"].split(" ")[0] not in article["title"]) or article["publisher"] == "South China Morning Post":
            i += 1
            if i == len(articles):
                article = articles[0]
                break
            article = articles[i]
        links.append(article["link"])
        data.append({"title": article["title"], "link": article["link"], "publisher": article["publisher"],
                     "time": datetime.datetime.utcfromtimestamp(article["providerPublishTime"])})

    return {"data": data}

@app.route("/get_portfolio_worth", methods=['POST'])
def get_portfolio_worth():
    db = get_db()

    stock_data = request.get_json()
    user_id = stock_data["user_id"]
    stocks = db["stocks"].find({"user_id": user_id})

    data = []
    total_worth = 0
    i = 0
    for stock in stocks:
        ticker = stock["ticker"]
        quantity = stock["quantity"]
        total_value = get_stock_price(ticker) * quantity
        total_worth += total_value
        data.append({"id": i, "label": ticker, "value": total_value})
        i += 1
    return {"total_value": total_worth, "data": data}

@app.route("/get_portfolio_table", methods=['POST'])
def get_portfolio_table():
    db = get_db()

    stock_data = request.get_json()
    user_id = stock_data["user_id"]
    stocks = db["stocks"].find({"user_id": user_id})

    data = []
    i = 0
    for stock in stocks:
        ticker = stock["ticker"]
        quantity = stock["quantity"]
        price = get_stock_price(ticker)
        total_value = price * quantity
        data.append({"id": i, "ticker": ticker, "quantity": quantity, "price": price, "value": total_value})
        i += 1
    return {"data": data}

def get_stock_price(ticker):
    stock = yf.Ticker(ticker)
    return stock.info['currentPrice']

def get_stock_name(ticker):
    stock = yf.Ticker(ticker)
    return stock.info['longName']

def get_stock_news(ticker):
    stock = yf.Ticker(ticker)
    return stock.news
