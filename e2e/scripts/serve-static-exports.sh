#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
GET_PORT="${GET_STATUS_APP_PORT:-3015}"
HUB_PORT="${HUB_PORT:-3013}"
SN_PORT="${STATUS_NETWORK_PORT:-3012}"

cd "$ROOT"

echo "🏗️  Building static exports..."
pnpm --filter get.status.app build
pnpm --filter hub build
pnpm --filter status.network build

echo "🔍 Verifying nested legal route aliases..."
for path in \
  "apps/get.status.app/out/legal/terms-of-use/index.html" \
  "apps/get.status.app/out/legal/privacy-policy/index.html" \
  "apps/hub/out/legal/terms-of-use/index.html" \
  "apps/hub/out/legal/privacy-policy/index.html" \
  "apps/hub/out/legal/status-network-pre-deposit-withdrawal-disclaimer/index.html" \
  "apps/status.network/out/legal/terms-of-use/index.html" \
  "apps/status.network/out/legal/privacy-policy/index.html"
do
  if [[ ! -f "$path" ]]; then
    echo "❌ Missing static export alias: $path"
    exit 1
  fi
done

echo "🚀 Serving static exports on ports ${GET_PORT}, ${HUB_PORT}, ${SN_PORT}..."
pnpm --filter get.status.app exec serve out -l "$GET_PORT" --no-port-switching &
GET_PID=$!
pnpm --filter hub exec serve out -l "$HUB_PORT" --no-port-switching &
HUB_PID=$!
pnpm --filter status.network exec serve out -l "$SN_PORT" --no-port-switching &
SN_PID=$!

cleanup() {
  kill "$GET_PID" "$HUB_PID" "$SN_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait_for_port() {
  local port="$1"
  for _ in $(seq 1 120); do
    if curl -sf "http://127.0.0.1:${port}/" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  echo "❌ Timed out waiting for port ${port}"
  exit 1
}

wait_for_port "$GET_PORT"
wait_for_port "$HUB_PORT"
wait_for_port "$SN_PORT"

echo "✅ All static export servers ready"
wait
