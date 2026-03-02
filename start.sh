#!/usr/bin/env bash
set -e
# Entrypoint for Railway / generic hosts that look for start.sh at repo root.
# This script delegates to the server folder.
cd "$(dirname "$0")/server"
echo "==> Installing dependencies (server)"
npm ci
echo "==> Building server"
npm run build
echo "==> Generating Prisma client"
npx prisma generate
echo "==> Applying migrations (if any)"
# Do not fail if there are no migrations or DB not ready yet in preview environments
npx prisma migrate deploy || true
echo "==> Starting server"
node dist/index.js
