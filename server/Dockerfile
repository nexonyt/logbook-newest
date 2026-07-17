FROM node:22-alpine

WORKDIR /app

# Copy package files from the server subdirectory
COPY server/package*.json ./

RUN npm install

# Copy all server code from the server subdirectory
COPY server/ .

# Copy the shared airports.json from the client subdirectory
COPY client/src/data/airports.json ../client/src/data/airports.json

EXPOSE 4040

CMD ["node", "logbook-index.js"]
