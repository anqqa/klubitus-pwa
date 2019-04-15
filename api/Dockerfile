FROM node:10-alpine

WORKDIR /srv/api

COPY package.json nodemon.json yarn.lock ./
RUN yarn install --pure-lockfile && yarn cache clean --force

#COPY . .

#EXPOSE ${API_PORT}
