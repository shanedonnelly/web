# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY back_end/package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY back_end .

# Expose port 3000 for the application
EXPOSE 8080

# Start the application
CMD [ "node", "serveur.js" ]