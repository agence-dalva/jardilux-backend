FROM node:20-slim
WORKDIR /app

# Install ALL deps (devDeps required for Vite/admin build)
COPY apps/backend/package.json ./package.json
RUN npm install --include=dev

# Source
COPY apps/backend/ .

# Build server + admin dashboard
RUN npm run build

# Fail early if admin wasn't built — avoids silent build failures
RUN ls .medusa/server/public/index.html

EXPOSE 9000
CMD ["npm", "run", "start"]
