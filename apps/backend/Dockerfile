FROM node:20-alpine
WORKDIR /app

# Layer cachée — ne réinstalle que si les package*.json changent
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/

RUN npm ci

# Source du backend
COPY apps/backend/ ./apps/backend/

WORKDIR /app/apps/backend
RUN npm run build

EXPOSE 9000

CMD ["npm", "run", "start"]
