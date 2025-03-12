# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

# # Build Next.js app
# RUN npm run build

# Use dynamic port from Render
EXPOSE 10000
CMD ["sh", "-c", "PORT=10000 npm run start"]


# Start the Next.js server
CMD ["npm", "run", "dev"]
