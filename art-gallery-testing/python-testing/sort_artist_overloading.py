import requests
import time
import random

names = ["Mark", "Chris", "Christopher", "Jessie", "James", "Alex", "Christine", "Mary", "Yuki", "Blade", "Shelly", "Aki", "Sam", "Samantha"]

username = "markprimaryadminusername"
password = "markprimaryadminpassword"

added_artists = []

# Maintain a session to add all artists.
with requests.Session() as session:

    # Log in
    session.post("http://localhost:3000/authentication/local", json={"username": username, "password": password})

    # Add artists
    for i in range(1000):

        # Get a random name for the list of names.
        firstName = random.choice(names)
        lastName = random.choice(names)

        # Create a bunch of artists
        new_artist_response = session.post("http://localhost:3000/artists", json={"firstName": f"{firstName}", "lastName": f"{lastName}"})
        added_artists.append(new_artist_response.json())

    # Log out
    session.post("http://localhost:3000/authentication/logout")

# Start the timer - only interested in the sort functionality now.
start_time = time.time()

# Repeat the sort get request multiple timess - somewhat replicating multple api calls.
for i in range(1000):

    with requests.Session() as session:

        # Log in
        session.post("http://localhost:3000/authentication/local", json={"username": username, "password": password})

        # Create a bunch of artists
        sorted_artists_response = session.get("http://localhost:3000/artists/firstNameSortedAsc")
        sorted_artists_by_name = sorted_artists_response.json()

        # for artist in sorted_artists_by_name:
        #     print(artist["firstName"])

        # Log out
        session.post("http://localhost:3000/authentication/logout")

# Stop the timer
stop_time = time.time()
        
# Get the clock time.
finish_time = stop_time - start_time
print(f"Completed in: {finish_time} seconds.")

# Post program clean up - will leave this out of the performance evaluation, I mostly just want to clean up the artist collection for a fresh database each time I run the program.
with requests.Session() as session:

    # Log in
    session.post("http://localhost:3000/authentication/local", json={"username": username, "password": password})   

    for artist in added_artists:
       
        artist_id = artist["_id"]

        # Delete entry to ensure each run starts with a clean artist collection.
        session.delete(f"http://localhost:3000/artists/{artist_id}")

    # Log out 
    session.post("http://localhost:3000/authentication/logout")

