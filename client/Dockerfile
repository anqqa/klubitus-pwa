FROM node:13-alpine

WORKDIR /srv/client

COPY client/package.json yarn.lock ./

RUN apk --no-cache --virtual .gyp add python make g++ \
    && yarn install --pure-lockfile \
    && yarn cache clean --force \
    && apk del .gyp

# COPY . .

# EXPOSE ${CLIENT_PORT}
