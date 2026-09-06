# AirPal.me

Guest companion + host operating system for hotels and residential colleges.

AirPal is a **production app**. The Harbour Hotel `/demo` path is an optional partner sample only.

## Install & run

Prefer Bun:

```bash
bun install
bun run dev
```

App: http://localhost:3005

Typecheck: `bunx tsc --noEmit`

## Environment

Copy `.env.example` to `.env` (gitignored). Never commit real secrets.

- `VITE_FIREBASE_*` — Firebase web config
- `VITE_BOOTSTRAP_ADMIN_EMAIL` — live Platform Admin email
- `VITE_BOOTSTRAP_ADMIN_PASSWORD` — live Platform Admin password (local only)

When both bootstrap vars are set, AirPal seeds a localStorage super_admin account (Bibin Jose) for `/auth` sign-in to `/admin`. It does not auto-login on the live site.

**Security:** Vite embeds `VITE_*` into the client bundle. Rotate the bootstrap password after launch. For production use Firebase Auth.

## Live paths

- `/` landing (Start / Sign in / Scan first; demo secondary)
- `/start` create property + guest QR
- `/auth` live sign-in (Platform Admin -> `/admin`)
- `/host` live host dashboard
- `/admin` Platform Admin console
- `/scan`, `/g/:id` guest QR (no guest accounts)
- `/demo` Harbour Hotel partner sample only

## Platform Admin

1. Set bootstrap email/password in local `.env`.
2. `bun run dev` then open `/auth`.
3. Sign in as Platform Admin -> `/admin`.
4. Demo personas (`admin@airpal.me`) are separate sample identities.

## Partner sample

Secondary CTAs / Host Partner sample / `/demo`. Leaving demo restores the stashed live session.

## Launch checklist

- [ ] Firebase config / hosting
- [ ] Rotate bootstrap password; plan Firebase Auth
- [ ] Verify `/start` `/auth` `/host` `/admin` `/scan` on live domain
- [ ] Keep `/demo` clearly labeled as sample
- [ ] Add `ios/` locally when ready (`npx cap add ios`)
- [ ] Prefer `bun install` and committed `bun.lock`
