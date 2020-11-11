FROM node:12-alpine

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD node -r dotenv/config ./build/server.js