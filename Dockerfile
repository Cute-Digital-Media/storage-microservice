# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production

FROM base as build

COPY . .

RUN yarn install

RUN yarn run build

FROM base as final

ENV NODE_ENV production

USER node

COPY --from=build /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]
