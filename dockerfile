# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY tsconfig.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the project files to the container
COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

CMD ["npm", "run", "dev"]
