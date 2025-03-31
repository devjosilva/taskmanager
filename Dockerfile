# Use the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy package-lock.json if it exists   
COPY package-lock.json ./
RUN npm install --production
# Copy .env file if it exists
#COPY .env ./
# Install additional dependencies if needed
# RUN npm install <additional-dependency>
# Copy the rest of the application code
# COPY . .
# Install additional dependencies if needed
# RUN npm install <additional-dependency>
# Install additional dependencies if needed


# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["npm", "start"]

