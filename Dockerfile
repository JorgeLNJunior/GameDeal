FROM node:24 AS builder

WORKDIR /usr/app/gamedeal

COPY . .

RUN npm i -g pnpm --frozen-lockfile

RUN pnpm install

RUN pnpm build

FROM nginx:1.31-alpine

COPY --from=builder /usr/app/gamedeal/apps/backend/dist /usr/app/gamedeal/apps/backend/dist
COPY --from=builder /usr/app/gamedeal/apps/backend/package.json /usr/app/gamedeal/apps/backend/package.json

COPY --from=builder /usr/app/gamedeal/apps/frontend/dist /usr/app/gamedeal/apps/frontend/dist
COPY --from=builder /usr/app/gamedeal/apps/frontend/package.json /usr/app/gamedeal/apps/frontend/package.json

COPY --from=builder /usr/app/gamedeal/pnpm* /usr/app/gamedeal/

COPY --from=builder /usr/app/gamedeal/setup/nginx.conf /etc/nginx/nginx.conf

RUN apk update && apk add "nodejs=~24" npm curl

# test nginx config file.
RUN nginx -t

# Installing pnpm through npm due to the alpine package being outdated.
RUN npm i -g pnpm

WORKDIR /usr/app/gamedeal

RUN pnpm install --production --frozen-lockfile

LABEL org.opencontainers.image.authors="JorgeLNJunior"
LABEL org.opencontainers.image.url="https://github.com/JorgeLNJunior/GameDeal/pkgs/container/gamedeal"
LABEL org.opencontainers.image.source="https://github.com/JorgeLNJunior/GameDeal"
LABEL org.opencontainers.image.licenses="GPL-3.0"
LABEL org.opencontainers.image.title="jorgelnjunior/gamedeal"
LABEL org.opencontainers.image.base.name="nginx:1.31-alpine"

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 CMD [ "curl", "-f", "http://localhost:3000/healthz" ]

EXPOSE 5000

# Prevent the api server running at $PORT when specified.
ENV APP_ENVIRONMENT="docker"

SHELL ["/bin/sh", "-c"]

CMD nginx -g "daemon off;"& node /usr/app/gamedeal/apps/backend/dist/main.js
