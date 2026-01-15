FROM node:20 AS builder

ARG APP=hub

WORKDIR /usr/src/status-web

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=${APP}

FROM node:20-slim

ARG APP=hub
ENV APP_NAME=${APP}

RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/status-web

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /usr/src/status-web/package.json ./
COPY --from=builder /usr/src/status-web/pnpm-lock.yaml ./
COPY --from=builder /usr/src/status-web/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/status-web/apps/${APP_NAME} ./apps/${APP_NAME}
COPY --from=builder /usr/src/status-web/packages ./packages
COPY --from=builder /usr/src/status-web/node_modules ./node_modules

WORKDIR /usr/src/status-web/apps/${APP_NAME}

CMD ["pnpm", "node", "start"]