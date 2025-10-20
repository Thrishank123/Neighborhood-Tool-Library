# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# ---

# Stage 2: Production environment
FROM node:18-alpine
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy code from the builder stage
COPY --from=builder /usr/src/app .

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
