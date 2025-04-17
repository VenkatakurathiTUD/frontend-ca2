# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose app port (change according to your app)
EXPOSE 3000

# Start app
CMD ["npm", "start"]


