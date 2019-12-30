FROM node:13-alpine

WORKDIR /srv/api

COPY api/package.json api/tsconfig.json api/tsconfig.build.json yarn.lock ./
#COPY api/patches patches/

RUN apk add --no-cache --virtual .gyp python make g++ \
  && yarn install --pure-lockfile \
  && yarn cache clean --force \
  && apk del .gyp

#COPY . .

#EXPOSE ${API_PORT}
