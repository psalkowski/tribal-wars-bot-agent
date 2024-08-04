FROM zenika/alpine-chrome:with-node AS base

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

FROM base AS build

COPY --chown=chrome . /usr/src/app

RUN yarn install && yarn build && cp package.json ./dist && cp yarn.lock ./dist
RUN cd dist && yarn workspaces focus --production

FROM base

COPY --from=build /usr/src/app/dist/ /usr/src/app

CMD ["/usr/bin/node", "/usr/src/app/index.js"]
