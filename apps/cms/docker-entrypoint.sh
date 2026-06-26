#!/bin/sh
# Production container entrypoint.
#
# Payload does NOT push the schema in production (see @payloadcms/db-postgres
# connect.js: pushDevSchema only runs when NODE_ENV !== 'production'). The
# repo policy is migrations for any deployed environment, so we apply pending
# SQL migrations before the server starts accepting traffic.
#
# `payload migrate` is idempotent — already-applied migrations are skipped, so
# this is safe to run on every (re)start.
set -e

echo "[entrypoint] Applying Payload migrations..."
PAYLOAD_CONFIG_PATH=payload.config.ts node_modules/.bin/payload migrate

# Seed/refresh the CMS database from the repo's content/ fixtures. The repo's
# model is "git content/ is the runtime source of truth" — this upserts that
# content into Payload (created/updated/skipped). Disable with
# CMS_SYNC_ON_BOOT=false (e.g. once editors manage content directly in Admin
# and you don't want git content overwriting their changes on every boot).
# Sync failure is non-fatal: the server still starts with whatever data exists.
if [ "${CMS_SYNC_ON_BOOT:-true}" != "false" ]; then
  echo "[entrypoint] Syncing content from content/ ..."
  if PAYLOAD_CONFIG_PATH=payload.config.ts node --import tsx scripts/sync-from-content.ts; then
    echo "[entrypoint] Content sync complete."
  else
    echo "[entrypoint] WARNING: content sync failed; starting with existing data. See logs above." >&2
  fi
fi

echo "[entrypoint] Starting server..."
exec "$@"
