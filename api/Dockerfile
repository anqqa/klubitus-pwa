FROM node:11-alpine

WORKDIR /srv/api

COPY api/package.json api/tsconfig.json api/tsconfig.build.json yarn.lock ./
COPY api/patches patches/
RUN yarn install --pure-lockfile && yarn cache clean --force

#COPY . .

#EXPOSE ${API_PORT}
