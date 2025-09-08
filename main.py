from dotenv import load_dotenv
load_dotenv()

import time
import random
import os
import firebase_admin
from firebase_admin import credentials, db

# Load Firebase credentials from environment variables
firebase_creds = {
    "type": os.environ.get("FIREBASE_TYPE"),
    "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
    "auth_uri": os.environ.get("FIREBASE_AUTH_URI"),
    "token_uri": os.environ.get("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.environ.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": os.environ.get("FIREBASE_UNIVERSE_DOMAIN"),
}

cred = credentials.Certificate(firebase_creds)
firebase_admin.initialize_app(cred, {
    'databaseURL': os.environ.get('FIREBASE_DATABASE_URL')
})

zones = ["A", "B", "C", "D", "E", "F"]
zone_counts = {zone: random.randint(20, 100) for zone in zones}

# Define movement patterns
movements = [
    ["A", "B"],           # Group 1: A -> B
    ["C", "B", "A", "D"], # Group 2: C -> B -> A -> D
    ["E", "F", "B"],      # Group 3: E -> F -> B
    ["D", "C"],           # Group 4: D -> C
    ["F", "A"],           # Group 5: F -> A
]

group_positions = [0 for _ in movements]  # Start all groups at their first zone

while True:
    # Move each group along its path
    for i, path in enumerate(movements):
        current_zone = path[group_positions[i]]
        next_pos = (group_positions[i] + 1) % len(path)
        next_zone = path[next_pos]

        # Move a random number of people (simulate movement)
        moving = random.randint(5, 15)
        if zone_counts[current_zone] >= moving:
            zone_counts[current_zone] -= moving
            zone_counts[next_zone] += moving

        group_positions[i] = next_pos

    ref = db.reference("/crowd")
    ref.set(zone_counts)
    print("Updated:", zone_counts)
    time.sleep(15)
