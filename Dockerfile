FROM node:20.9-alpine AS build

ENV PUPPETEER_CACHE_DIR="/app/.cache"

WORKDIR /app
COPY . /app

RUN apk add git python3 build-base --no-cache
RUN yarn install && yarn build && cp package.json ./dist && cp yarn.lock ./dist
RUN cd dist && yarn workspaces focus --production

FROM node:20.9-alpine

ENV PUPPETEER_CACHE_DIR="/app/.cache"

WORKDIR /app

COPY --from=build /app/.cache /app/.cache
COPY --from=build /app/dist/ /app

CMD ["/usr/local/bin/node", "/app/index.js"]
