<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TrimBook client

Barber/salon booking frontend. One Next.js 16 App Router app — no workspaces, no sub-packages. This directory is its own git repo (the parent folder has a separate one — don't run git commands against `..`).

## Layout

- `app/` — routes; pages are mostly `.jsx`, `app/dashboard/**` is the authenticated area.
- `components/ui/` — shadcn/ui kit (`.tsx`); `components/*.jsx` — app components.
- `lib/` — `api.js` (`apiRequest()` wrapper), `auth.js` / `auth-client.js` (better-auth server + client), `uploadImage.js` (ImgBB).
- `middleware.js` (root) — cookie-presence redirect to `/sign-in` for `/dashboard/*` and `/services/[id]` (matcher: `/dashboard/:path*`, `/services/:path+`).
- **The backend is not in this repo.** It's the sibling directory `../trimbook-server/` — a plain Express server on port 5000 (`index.js`, `middlewares/`, own `package.json` + `.env`), run with `nodemon index.js`. nodemon is installed **globally**, not in its `package.json`. Its `nodemon.json` watches only backend files (`index.js`, `middlewares`, `.env`, …) — without it nodemon watches the whole tree and restarts the backend whenever any client `.js/.json` changes, briefly failing every API call. nodemon reads that config only at startup.

## Commands

- `npm run dev` — dev server on :3000
- `npm run lint` — flat-config ESLint; passes (0 errors, ~26 pre-existing warnings: unused `error` vars, `<img>` vs `next/image`, `window.location.href` navigation)
- `npm run typecheck` — `tsc --noEmit`; covers only `.ts/.tsx` — **JSX pages are not type-checked**, so lint is the only real check for them
- `npm run format` — Prettier on `**/*.{ts,tsx}` only; it does **not** touch the `.jsx`/`.js` majority, and `.prettierrc` sets `semi: false` while existing JS files use semicolons — don't reformat them wholesale
- No tests, no CI. Verify with: `npm run lint && npm run typecheck`

## Auth / data flow (can't be guessed from filenames)

- Authenticated and mutating calls go through `apiRequest()` in `lib/api.js`; it reads the better-auth session token and sends it as `Authorization: Bearer …`, base URL `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). A few public pages (`app/page.jsx`, `app/services/**`) bypass it with plain `fetch` and a duplicated local `API_BASE_URL` const — same env var.
- Feature work needs the backend running (`nodemon index.js` in `../trimbook-server/`) or data calls fail with a raw fetch/network error.
- better-auth runs inside this app at `app/api/auth/[...all]` → `lib/auth.js` (MongoDB adapter, db `trimbook`). Client `.env`: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_IMGBB_API_KEY`. Backend `../trimbook-server/.env`: `DB_USER`, `DB_PASSWORD`, `MONGODB_URI`, `PORT`, `CLIENT_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Stripe keys live only on the backend — the client never reads them (checkout redirects to a URL from `POST /api/payments/create-checkout-session`).
- Route protection is split: `middleware.js` checks cookie presence only; **role gating is client-side** in `app/dashboard/layout.jsx` via `ADMIN_ONLY_ROUTES` / `CUSTOMER_ONLY_ROUTES`. Adding a dashboard page? Add its path to the correct list there or the wrong role gets bounced.

## Conventions

- Tailwind CSS v4 — no `tailwind.config`; theme/variables live in `app/globals.css`. shadcn style `base-nova`: add components with `npx shadcn@latest add <name>`.
- Path alias `@/*` → repo root (see `tsconfig.json`).
- Mixed JS/TS is intentional: pages `.jsx`, UI kit `.tsx`. Don't mass-convert.
- Using `next/image` with a new host? Whitelist it in `next.config.ts` `images.remotePatterns` (currently `i.ibb.co`, `lh3.googleusercontent.com`, `images.unsplash.com`).
- Toasts via `react-toastify`; session hooks (`useSession`, `signIn`, …) come from `lib/auth-client`, never from `better-auth/react` directly.
