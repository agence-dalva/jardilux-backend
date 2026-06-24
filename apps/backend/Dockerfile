FROM node:20-slim
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN yarn install --frozen-lockfile --non-interactive

COPY apps/backend/ ./apps/backend/
WORKDIR /app/apps/backend
RUN NODE_ENV=development yarn build

WORKDIR /app/apps/backend/.medusa/server
RUN yarn install --non-interactive --production

EXPOSE 9000

CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && yarn start"]
