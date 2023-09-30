# Art Gallery

This repo contains all code for the Art Gallery.

## Summary of Project

This project was initially created for an assessment task for SIT331 - Secure Backend Services at Deakin University. 

Now, it will continue in another assessment task for SIT315 - Concurrent and Distributed Programming where I will attempt to apply distributed concepts using Docker.

My plan is to split the various concepts that I'm learning and testing into separate branches.

## Art Gallery - Distributed System - 1

This is the first phase of the distributed system where I attempt to keep things relatively simple and focus on Dockerization.

This branch will feature:

- Dockerization of the express.js application and database as two separate services that will run via a Docker-Compose file.
- A testing folder which has newman based end-to-end tests.
- Python scripts running endpoint requests in a loop to test performance when the express.js application is replicated in a swarm.

### Starting Art Gallery API and Art Gallery Database services

#### Simple Docker Compose Flow

To get the containers running, run the commands below (technically, we should only need to run build if we made a change to the Dockerfile).

1. docker-compose build
2. docker-compose up

Once done and you have exited the containers, run the commands below to remove the containers and remove any anonymous volumes.

1. docker-compose down
2. docker volume prune 

#### Docker Swarm Flow

These commands will start up the containers in Docker Swarm mode.

The way I understood this and from my own testing, these commands are only needed if the custom image for the express application has not been added to the local registry yet.

1. docker service create --name registry --publish published=5000,target=5000 registry:2
2. docker-compose push

These commands will start up the express application containers with the desired number of replicas.

1. docker swarm init
2. docker stack deploy --compose-file docker-compose.yml art-gallery-express-app
3. docker stack services art-gallery-express-app
4. docker service scale art-gallery-express-app_art-gallery-api=4

Use this to exit swarm mode.

1. docker swarm leave --force

### Running end-end tests

Make sure node, newman and htmlextra are installed.

To run the end-to-end tests while the express.js application and database are running in their respective containers:

1. Run:

    ```shell
    cd 'art-gallery-testing\newman-testing'
    ```
2. Once in the folder, run:

    ```shell
    newman run collection.json -e environment.json -r htmlextra
    ```
3. Check the newman folder for the html output.

### Running Python scripts.

Just run the Python script via the play button.