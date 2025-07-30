FROM node:18-alpine as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as production

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package*.json ./

RUN npm ci --only=production

COPY --from=dev /usr/src/app/dist ./dist

EXPOSE 80

CMD ["node", "dist/main/index.js"]
