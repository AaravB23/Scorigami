# Initializes the Firestore database for the first time, loading the data

import firebase_admin
from firebase_admin import firestore, credentials
import json
import os

# Finds dir of current script and the service account key
script_dir = os.path.dirname(__file__)
key_path = os.path.join(script_dir, "serviceAccountKey.json");

# Initializes app
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

# Finds JSON path
json_path = os.path.join(script_dir, "..", "public", "nfl_scores_cleaned.json") 

with open(json_path, 'r') as d:
    # data is a list of dictionaries, one per game
    data = json.load(d);

games_collection = db.collection("games")

# Adds to 'games' collection each game
for game in data:
    games_collection.add(game)

# Count all docs in 'games'
db_size = len(games_collection.get())
print(f"DB size: {db_size} games")