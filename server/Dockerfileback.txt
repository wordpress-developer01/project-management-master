FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies first for better caching
COPY package*.json ./
COPY server/package*.json ./server/
WORKDIR /app/server
COPY server/ ./

RUN npm ci --production=false
RUN npm run build
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/index.js"]
