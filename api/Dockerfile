FROM node:10-alpine

WORKDIR /srv/api

COPY package.json .
RUN yarn install && yarn cache clean --force

COPY . .

EXPOSE ${API_PORT}
