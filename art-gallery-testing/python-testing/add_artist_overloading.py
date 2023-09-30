import requests
import time

username = "markprimaryadminusername"
password = "markprimaryadminpassword"

added_artists = []

# Start the timer
start_time = time.time()

# Add artists
for i in range(1000):

    # Maintain a session
    with requests.Session() as session:

        # Log in
        session.post("http://localhost:3000/authentication/local", json={"username": username, "password": password})

        # Create a bunch of artists
        newArtistResponse = session.post("http://localhost:3000/artists", json={"firstName": f"First Name {i}", "lastName": f"Last Name {i}"})
        added_artists.append(newArtistResponse.json())

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

