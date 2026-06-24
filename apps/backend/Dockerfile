FROM node:20-slim AS deps
WORKDIR /app
COPY apps/backend/package.json ./
RUN npm install --include=dev

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/backend/ .
RUN NODE_ENV=development npm run build

FROM node:20-slim AS runtime
WORKDIR /app/.medusa/server
COPY --from=builder /app/.medusa/server .
RUN npm install --omit=dev

EXPOSE 9000

CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && npm run start"]
