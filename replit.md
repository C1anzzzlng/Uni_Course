# Xlore U

An intelligent school-matching platform for senior high school students in Taguig City, Philippines — helping them discover, compare, and save colleges aligned with their academic strand, interests, and budget.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/xlore-u run dev` — run the frontend (port 22728, proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PROXY_URL`, `SESSION_SECRET`
- Optional env: `VITE_GOOGLE_MAPS_KEY` — enables Google Maps on `/map` and `/schools/:id`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, shadcn/ui, Clerk auth, wouter, TanStack Query, framer-motion
- API: Express 5 + Clerk middleware
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for all endpoints)
- `lib/api-client-react/src/generated/` — Generated React Query hooks (via Orval)
- `lib/api-zod/` — Generated Zod schemas for request/response validation
- `lib/db/src/schema/index.ts` — All Drizzle DB table definitions
- `artifacts/api-server/src/routes/` — Express route handlers (schools, programs, saved, assessment, users, stats)
- `artifacts/xlore-u/src/pages/` — All frontend pages
- `artifacts/xlore-u/src/components/layout.tsx` — Sidebar + AppLayout wrapper
- `artifacts/xlore-u/src/App.tsx` — Clerk provider, routing, protected routes

## Architecture decisions

- **Contract-first API**: OpenAPI spec in `lib/api-spec` drives Orval codegen for both React hooks and Zod schemas. Never write fetch calls manually.
- **Clerk proxy**: All Clerk API calls are proxied through the Express server at `/api/__clerk` to avoid CORS issues in the Replit iframe environment. `VITE_CLERK_PROXY_URL` points to this proxy.
- **Auto user creation**: API routes auto-create a DB user row on first Clerk-authenticated request (no explicit signup step needed for DB).
- **Admin role**: Set `role = 'admin'` in the `users` table manually to grant admin panel access. Admin panel is hidden from non-admin users.
- **Google Maps optional**: Map features degrade gracefully if `VITE_GOOGLE_MAPS_KEY` is not set, showing a static placeholder instead.

## Product

- **Landing page** — Hero, feature highlights, and stats for unauthenticated visitors
- **Auth** — Clerk email/password sign-in and sign-up with OTP/forgot-password support
- **Dashboard** — Personalized welcome + live stats (total schools, programs, assessment CTA)
- **School Directory** (`/schools`) — 22 Taguig institutions with search, type filter, strand filter, and save/bookmark
- **School Detail** (`/schools/:id`) — Full school info, programs offered, Google Maps embed
- **Programs** (`/programs`) — 39 programs with search and strand/category filters, save/bookmark
- **School Map** (`/map`) — Interactive Google Maps view of all schools
- **Compare** (`/compare`) — Side-by-side comparison of up to 3 schools across key attributes
- **Self-Assessment** (`/assessment`) — 5-question quiz mapping interests to recommended programs and schools
- **Results** (`/results`) — AI-matched program and school recommendations from assessment
- **Saved Items** (`/saved`) — Bookmarked schools and programs
- **Profile** (`/profile`) — Update display name, view Clerk account details
- **Admin Panel** (`/admin`) — CRUD for schools and programs (admin role required)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any changes to `lib/api-spec/openapi.yaml`.
- Run `pnpm --filter @workspace/db run push` after any changes to `lib/db/src/schema/`.
- Do NOT call service ports directly in curl; always use `localhost:80/<path>` through the shared proxy.
- Admin panel access requires setting `role = 'admin'` directly in the DB — no UI for this yet.
- Clerk uses development keys in this environment — do not use in production without switching to production keys.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.local/skills/clerk-auth/references/setup-and-customization.md` for Clerk frontend setup pattern
