<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TrimBook client

Barber/salon booking frontend. One Next.js 16 App Router app — no workspaces, no sub-packages.

## Layout

- `app/` — routes; pages are mostly `.jsx`, `app/dashboard/**` is the authenticated area.
- `components/ui/` — shadcn/ui kit (`.tsx`); `components/*.jsx` — app components.
- `lib/` — `api.js` (every backend call), `auth.js` / `auth-client.js` (better-auth server + client), `uploadImage.js` (ImgBB).
- `middleware.js` (root) — cookie-presence redirect to `/sign-in` for `/dashboard/*` and `/services/[id]`.
- **The backend is not in this repo.** It's the parent directory (`../index.js`, `../middlewares/`, own `package.json` + `.env`) — a plain Express server on port 5000, run under `nodemon index.js`. Its watch scope lives in `nodemon.json` in the parent (backend files only — without it nodemon watches the whole tree and restarts the backend whenever any client `.js/.json` changes, briefly failing every API call). nodemon reads that config only at startup.

## Commands

- `npm run dev` — dev server on :3000
- `npm run lint` — flat-config ESLint; currently passes (0 errors, some pre-existing warnings)
- `npm run typecheck` — `tsc --noEmit`; covers only `.ts/.tsx` — **JSX pages are not type-checked**, so lint is the only real check for them
- `npm run format` — Prettier on `**/*.{ts,tsx}` only; it does **not** touch the `.jsx`/`.js` majority, and `.prettierrc` sets `semi: false` while existing JS files use semicolons — don't reformat them wholesale
- No tests, no CI. Verify with: `npm run lint && npm run typecheck`

## Auth / data flow (can't be guessed from filenames)

- All backend calls go through `apiRequest()` in `lib/api.js`; it attaches the better-auth JWT as a `Bearer` token and uses `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). Feature work needs the backend running or these calls fail with a "trimbook-server" error.
- better-auth itself runs inside this app at `app/api/auth/[...all]` and needs `.env`: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, Google OAuth vars, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, ImgBB + Stripe keys. (Backend's own `.env` in the parent dir: `DB_USER`, `DB_PASSWORD`, `PORT`, `CLIENT_URL`.)
- Route protection is split: `middleware.js` checks cookie presence only; **role gating is client-side** in `app/dashboard/layout.jsx` via `ADMIN_ONLY_ROUTES` / `CUSTOMER_ONLY_ROUTES`. Adding a dashboard page? Add its path to the correct list there or the wrong role gets bounced.

## Conventions

- Tailwind CSS v4 — no `tailwind.config`; theme/variables live in `app/globals.css`. shadcn style `base-nova`: add components with `npx shadcn@latest add <name>`.
- Path alias `@/*` → repo root (see `tsconfig.json`).
- Mixed JS/TS is intentional: pages `.jsx`, UI kit `.tsx`. Don't mass-convert.
- Using `next/image` with a new host? Whitelist it in `next.config.ts` `images.remotePatterns`.
- Toasts via `react-toastify`; session hooks (`useSession`, `signIn`, …) come from `lib/auth-client`, never from `better-auth/react` directly.
