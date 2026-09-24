FROM node:20-slim
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/package.json
RUN yarn install --frozen-lockfile --non-interactive

COPY apps/backend/ ./apps/backend/
WORKDIR /app/apps/backend
# SITE_SUSPENDED=false est forcé ici : si la variable vaut "true" au moment du
# build, Medusa saute la compilation du dashboard admin et l'image ne le
# contient plus du tout. Le blocage doit rester une décision d'exécution.
RUN NODE_ENV=development SITE_SUSPENDED=false yarn build

WORKDIR /app/apps/backend/.medusa/server
RUN yarn install --non-interactive --production

EXPOSE 9000

CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && yarn start"]
