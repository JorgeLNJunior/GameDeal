FROM node:24 AS builder

WORKDIR /usr/app/gamedeal

COPY ../../ .

RUN npm i -g pnpm

RUN pnpm install

RUN pnpm build:frontend

FROM nginx:1.31-alpine

COPY --from=builder /usr/app/gamedeal/apps/frontend/dist /usr/app/gamedeal/apps/frontend/dist
COPY --from=builder /usr/app/gamedeal/apps/frontend/package.json /usr/app/gamedeal/apps/frontend/package.json
COPY --from=builder /usr/app/gamedeal/pnpm* /usr/app/gamedeal/
COPY --from=builder /usr/app/gamedeal/apps/frontend/setup/nginx.conf /etc/nginx/nginx.conf

RUN apk update && apk add "nodejs=~24" npm curl

# test nginx config file.
RUN nginx -t

# Installing pnpm through npm due to alpine package being outdated.
RUN npm i -g pnpm

WORKDIR /usr/app/gamedeal

RUN pnpm install --prod --filter frontend

LABEL org.opencontainers.image.authors="JorgeLNJunior"
LABEL org.opencontainers.image.url="https://github.com/JorgeLNJunior/mango/pkgs/container/gamedealfrontend"
LABEL org.opencontainers.image.source="https://github.com/JorgeLNJunior/GameDeal"
LABEL org.opencontainers.image.licenses="GPL-3.0"
LABEL org.opencontainers.image.title="gamedealfrontend"
LABEL org.opencontainers.image.base.name="nginx:1.31-alpine"

EXPOSE 3000
