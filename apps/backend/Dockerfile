FROM node:24 AS builder

WORKDIR /usr/app/gamedeal

COPY ../../ .

RUN npm i -g pnpm

RUN pnpm install

RUN pnpm build:backend

FROM alpine:3.24

COPY --from=builder /usr/app/gamedeal/apps/backend/dist /usr/app/gamedeal/apps/backend/dist
COPY --from=builder /usr/app/gamedeal/apps/backend/package.json /usr/app/gamedeal/apps/backend/package.json
COPY --from=builder /usr/app/gamedeal/pnpm* /usr/app/gamedeal/

RUN apk update && apk add "nodejs=~24" npm curl

# Installing pnpm through npm due to the alpine package being outdated.
RUN npm i -g pnpm

WORKDIR /usr/app/gamedeal

RUN pnpm install --prod --filter backend

LABEL org.opencontainers.image.authors="JorgeLNJunior"
LABEL org.opencontainers.image.url="https://github.com/JorgeLNJunior/GameDeal/pkgs/container/gamedealbackend"
LABEL org.opencontainers.image.source="https://github.com/JorgeLNJunior/GameDeal"
LABEL org.opencontainers.image.licenses="GPL-3.0"
LABEL org.opencontainers.image.title="jorgelnjunior/gamedealbackend"
LABEL org.opencontainers.image.base.name="alpine:3.24"

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 CMD [ "curl", "-f", "http://localhost:3000/healthz" ]

EXPOSE 3000

ENTRYPOINT [ "node", "/usr/app/gamedeal/apps/backend/dist/main.js" ]
