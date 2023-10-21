import json
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone

app = Flask(__name__)


@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"
