# Use an official Node.js runtime as a parent image
FROM node:20.13

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY . .
RUN npm install

# Build the app
RUN npm run build

# Serve the app with a simple web server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-1", "5000"]

# Expose the port the app runs on
EXPOSE 5000