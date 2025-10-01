import firebase_admin
from firebase_admin import firestore, credentials
import json
import os

script_dir = os.path.dirname(__file__)
key_path = os.path.join(script_dir, "serviceAccountKey.json");

cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

json_path = os.path.join(script_dir, "..", "public", "nfl_scores_cleaned.json") 

with open(json_path, 'r') as d:
    data = json.load(d);

games_collection = db.collection("games")

for game in data:
    games_collection.add(game)

count_query = games_collection.count()
result = count_query.get()
db_size = result[0][0].value

print(f"DB size: {db_size} games")