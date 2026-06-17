FROM node:20-slim
WORKDIR /app

# Install ALL deps (devDeps required for Vite/admin build)
COPY apps/backend/package.json ./package.json
RUN npm install --include=dev

# Source
COPY apps/backend/ .

# NODE_ENV=development requis pour que medusa build compile le dashboard admin
# (avec NODE_ENV=production, medusa build skip la compilation Vite de l'admin)
RUN NODE_ENV=development npm run build

# Install runtime deps in the compiled output (Medusa v2 requirement)
RUN cd .medusa/server && npm install

EXPOSE 9000

# Démarrer depuis .medusa/server comme préconisé par Medusa v2
# predeploy = medusa db:migrate
CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && cd /app/.medusa/server && npm run start"]
