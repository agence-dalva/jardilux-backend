# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Layer cachée — ne réinstalle que si package*.json change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Uniquement les dépendances de production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Artefact de build Medusa
COPY --from=builder /app/.medusa ./.medusa

EXPOSE 9000

CMD ["npm", "run", "start"]
