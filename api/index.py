import json
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone

app = Flask(__name__)


@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/sign_in_test")
def sign_in_test():
    response_body = {
        "success": True,
        "user_id" : 34
    }

    return response_body
