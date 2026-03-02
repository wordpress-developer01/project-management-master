Deploy backend to Railway (quick guide)

This file explains the minimal steps to get the `server/` service running on Railway.

1) Option A — quick (no repo changes)

- In Railway create New Project → Deploy from GitHub and select this repository.
- Set Root Directory to `server`.
- Build command:

  npm ci && npm run build && npx prisma generate

- Start command:

  npx prisma migrate deploy && node dist/index.js

- Add environment variables in Railway Settings → Variables:
  - DATABASE_URL — Postgres connection string (Railway can provision a DB plugin)
  - NODE_ENV=production
  - optional: JWT_SECRET, etc.

- Trigger deploy and watch logs. After success open the generated service URL and request `/` — it should return "This is home route".

2) Option B — monorepo root deploy (Railpack/start.sh detection)

- We added `Procfile` and `start.sh` at repo root to help platforms that look for `start.sh` or `Procfile`.
- If you deployed the whole repo (root), Railpack will now find `start.sh` and run the server.

3) Local quick test (before deploy):

  cd server
  npm ci
  npm run build
  npx prisma generate
  # if you have a DB available locally, apply migrations:
  npx prisma migrate deploy
  node dist/index.js
  # in another terminal:
  curl http://localhost:3000/

4) After deploy

- Copy the Railway service URL, then add to the Netlify site variables:
  - NEXT_PUBLIC_API_BASE_URL = https://<railway-app>.up.railway.app
- Trigger a Netlify redeploy (Clear cache and deploy).

If you want, I can also add a `server/Procfile` or further automate `prisma migrate` handling — tell me which provider step you'd like me to do next.
