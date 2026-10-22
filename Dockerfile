# ---------- Stage 1: build the React app ----------
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Stage 2: serve the built files with nginx ----------
# Only the static files from stage 1 are kept, so the final image is tiny
# (no Node, no node_modules, no source code).
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]