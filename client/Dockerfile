FROM node:10-alpine

WORKDIR /srv/client

COPY package.json .
COPY yarn.lock .
RUN yarn install && yarn cache clean --force

COPY . .

EXPOSE ${CLIENT_PORT}
