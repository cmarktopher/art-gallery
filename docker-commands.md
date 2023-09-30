# Docker Commands

## Simple Docker Compose Flow
- docker-compose build
- docker-compose up
- docker-compose down
- docker volume prune 

## Docker Swarm
- docker swarm init
- docker service create --name registry --publish published=5000,target=5000 registry:2
- docker-compose push
- docker stack deploy --compose-file docker-compose.yml art-gallery-express-app
- docker stack services art-gallery-express-app
- docker service scale art-gallery-express-app_art-gallery-api=4
- docker swarm leave --force