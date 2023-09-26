# Pull the base image.
FROM node:20

# Set the working directory.
WORKDIR /art-gallery-api

# Copy the package json and install npm packages first - this is good for quicker Dockerfile builds (assuming the package or anything before it doesn't change).
COPY package.json .
RUN npm install

# Copy everything into the working directory.
COPY . ./

# Expose port 3000 - Not 100% sure if this is actually needed since we are doing the port binding and handling of env variables in the docker-compose files.
ENV PORT 3000
EXPOSE $PORT

# This too, should be ignored as we have defined npm run dev within the docker-compose file.
CMD ["node", "app.js"]