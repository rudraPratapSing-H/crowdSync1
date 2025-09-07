import time
import random
import firebase_admin
from firebase_admin import credentials, db

# Firebase setup
cred = credentials.Certificate("serviceAccountKey.json")  # download from Firebase
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://crowdmanagement-e36d0-default-rtdb.asia-southeast1.firebasedatabase.app/'
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
    time.sleep(5)
