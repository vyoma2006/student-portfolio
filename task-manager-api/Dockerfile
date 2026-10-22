# Node 22 (Node 18 from the lab sheet is too old for current Vite/React tooling)
FROM node:22-slim

WORKDIR /app

# Copy package files first so Docker can cache the npm install layer
COPY package*.json ./
RUN npm install --omit=dev

# Then the source (node_modules and .env are excluded by .dockerignore)
COPY . .

# Documents the port the app listens on (does NOT publish it, compose does that)
EXPOSE 5050

CMD ["node", "server.js"]