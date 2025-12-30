FROM node:18.4.0-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 3000

# Run the app in production
CMD ["npm", "run", "start:prod"]
