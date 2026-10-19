# syntax=docker/dockerfile:1.7

# The scanner runs from /src without network access after this build.
FROM node:22.17.0-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl git python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

WORKDIR /src
COPY . /src

# The scanner clones the repository without initializing its submodules.
RUN git submodule update --init --recursive

RUN pnpm install --frozen-lockfile

# Build the browser wallet, connector, and their workspace dependencies. Keep
# the full checkout and dependencies available for other targeted checks.
ENV NODE_OPTIONS=--max-old-space-size=5120
RUN pnpm turbo run build --filter=wallet... --filter=connector... --concurrency=1
RUN pnpm --filter @status-im/js build

# Match the Foundry version used in this repository's CI. Compile contracts
# while network access is available so Solc is cached for offline tests.
COPY --from=ghcr.io/foundry-rs/foundry:v1.5.1 /usr/local/bin/forge /usr/local/bin/forge
COPY --from=ghcr.io/foundry-rs/foundry:v1.5.1 /usr/local/bin/cast /usr/local/bin/cast
COPY --from=ghcr.io/foundry-rs/foundry:v1.5.1 /usr/local/bin/anvil /usr/local/bin/anvil
RUN pnpm --filter @status-im/community-contracts build

CMD ["bash"]
