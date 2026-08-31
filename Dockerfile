FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "build/server.js"]
