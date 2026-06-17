FROM node:20-alpine
WORKDIR /app

# Layer cachée — npm ci ne tourne que si package*.json change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 9000

CMD ["npm", "run", "start"]
