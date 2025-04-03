# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn run build

# Set the environment variable for the port
ENV PORT=3010

# Expose port 3010 to the host
EXPOSE 3010

# Start the Next.js app and specify the port in the CMD instruction
CMD ["yarn", "start", "-p", "3010"]
