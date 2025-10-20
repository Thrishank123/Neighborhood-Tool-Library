# Stage 1: Build the React application
# FROM node:20.5.0-alpine
FROM node:20.19.0-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the application for production
RUN npm run build

# ---

# Stage 2: Serve the application using NGINX
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove the default NGINX content
RUN rm -rf ./*

# Copy the built files from the builder stage
COPY --from=builder /app/dist .

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]