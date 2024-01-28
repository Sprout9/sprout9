# Use the official Node.js  image as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the local code to the container's working directory
COPY . .

# Set dummy environment variables, should be overwritten at runtime.
ENV NODE_ENV=production
ENV DB_NAME=dummy
ENV MONGODB_URI="mongodb://dummy:dummy@dummy.com"
ENV NODEMAILER_USER=dummy
ENV NODEMAILER_PASS=dummy

# Build the Next.js app
RUN npm run build

ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port that Next.js is listening on
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js app
CMD ["npm", "start"]
