# Use Node.js base image
FROM node:18-alpine3.18

# Create and set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies, including bcrypt
RUN apk add --no-cache python3 make g++ \
&& npm i bcrypt && npm install 

# Copy the rest of the application code into the container
COPY . .

# Compile TypeScript files to the dist folder
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD [ "npm","run","start" ]