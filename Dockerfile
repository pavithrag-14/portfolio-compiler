# Production Dockerfile for Portfolio Compiler
FROM node:22-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build Vite frontend client into dist/
RUN npm run build

# Configure production environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose default port
EXPOSE 5000

# Start Express server serving production static frontend and backend APIs
CMD ["npm", "start"]
