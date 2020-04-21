# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:12

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /usr/src/app

# Install dependencies
COPY . ./
RUN npm install

# Copy source files from host computer to the container





# Run the app
CMD [ "npm", "audit", "fix" ]


