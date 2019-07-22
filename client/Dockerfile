FROM node:10-alpine

WORKDIR /srv/client

COPY client/package.json yarn.lock ./
RUN yarn install --pure-lockfile && yarn cache clean --force

# COPY . .

# EXPOSE ${CLIENT_PORT}
