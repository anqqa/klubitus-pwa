FROM node:11-alpine

WORKDIR /srv/client

COPY client/package.json yarn.lock ./
RUN apk --no-cache --virtual build-dependencies add python make g++ \
    && yarn install --pure-lockfile && yarn cache clean --force \
    && apk del build-dependencies

# COPY . .

# EXPOSE ${CLIENT_PORT}
