# Use the official Node.js  image as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the local code to the container's working directory
COPY . .

# Set the environment variable to production
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build


ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port that Next.js is listening on
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js app
CMD ["npm", "start"]
