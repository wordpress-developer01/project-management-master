#!/usr/bin/env bash
set -e
# Server start helper (used when running directly from server folder)
echo "==> Installing server dependencies"
npm ci
echo "==> Building server"
npm run build
echo "==> Generating Prisma client"
npx prisma generate
echo "==> Applying migrations (if any)"
npx prisma migrate deploy || true
echo "==> Launching server"
node dist/index.js
