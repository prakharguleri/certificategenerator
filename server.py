from flask import Flask, request, send_file, jsonify
from pymongo import MongoClient
import os

app = Flask(__name__)

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["iitd-certificates"]
collection = db["certificates"]

@app.route("/certificate", methods=["GET"])
def get_certificate():
    entry = request.args.get("entry")
    cert = collection.find_one({"entryNumber": entry})

    if cert:
        file_path = f"./public{cert['filePath']}"
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)

    return jsonify({"error": "Certificate not found"}), 404

if __name__ == "__main__":
    app.run(port=5000)
