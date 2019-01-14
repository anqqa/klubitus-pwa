FROM node:10-alpine

WORKDIR /srv/client

COPY package.json .
RUN yarn install && yarn cache clean --force

COPY . .

EXPOSE ${CLIENT_PORT}
