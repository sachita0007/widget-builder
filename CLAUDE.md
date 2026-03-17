# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start Next.js dev server (Turbo)
npm run build            # Production build
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run check            # Lint + TypeScript type check
npm run typecheck        # TypeScript type check only
npm run format:write     # Prettier auto-format
npm run db:push          # Push Prisma schema to database (no migration)
npm run db:generate      # Generate Prisma client + run migrations
npm run db:migrate       # Deploy pending migrations
npm run db:studio        # Open Prisma Studio GUI
npx prisma db seed       # Seed database (uses prisma/seed.ts)
```

## Architecture

T3 Stack app: Next.js 15 (App Router) + tRPC 11 + Prisma 6 (PostgreSQL) + NextAuth 5 + Tailwind CSS 4.

**Purpose:** A platform for product brands to collect verified reviews from sampling campaigns and deploy embeddable review widgets.

### tRPC Flow

- **Server setup:** `src/server/api/trpc.ts` — defines `createTRPCContext`, `publicProcedure`, and `protectedProcedure` (requires auth). Timing middleware adds artificial network delay in dev.
- **Routers:** `src/server/api/routers/` — four routers (campaign, widget, review, ai) combined in `src/server/api/root.ts` as `appRouter`.
- **HTTP adapter:** `src/app/api/trpc/[trpc]/route.ts` — handles GET/POST at `/api/trpc`.
- **Client-side:** `src/trpc/react.tsx` — TRPCReact with `httpBatchStreamLink`, SuperJSON, shared QueryClient (staleTime: 30s).
- **RSC support:** `src/trpc/server.ts` — `api` object for server component calls, `HydrateClient` for hydration.

### Auth

NextAuth v5 (beta) with JWT sessions and PrismaAdapter. Providers: Discord OAuth + Credentials (demo login with `demo@freestand.in`, no password). Config in `src/server/auth/config.ts`, exports (`auth`, `signIn`, `signOut`) from `src/server/auth/index.ts`.

### Widget Embed System

1. **Embed endpoint:** `GET /api/widget/[id]/embed` returns a JS script for external sites.
2. **Script behavior:** Finds its `<script>` tag by `data-widget-id`, creates a container div, injects an iframe to `/widget/[id]`.
3. **Auto-resize:** Listens for `postMessage` events (type: `freestand-resize`) to dynamically adjust iframe height.
4. **Public data:** `widget.getPublicById` is a public tRPC procedure (no auth) so embedded widgets can fetch data.

### AI Integration

Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai`. The `ai.generateInsight` procedure generates marketing copy from campaign metrics. Four intent types: TRIAL_VERDICT, SWITCHER, HABIT_BREAKER, DEMOGRAPHIC. Falls back to heuristic generation if API fails. Requires `GEMINI_API_KEY` env var.

### Data Model

`Campaign` → has many `Persona` (customer segments), `Review`, and `Widget`. `Widget` stores template type (GOOGLE, AGGREGATED, IMAGE, AI_GEN) and a JSON `settings` field for all customization. `Review` links to both `Campaign` and optionally a `Persona`. All cascading deletes from Campaign.

## Key Conventions

- **Path alias:** `~/` maps to `src/` (e.g., `import { db } from "~/server/db"`)
- **Components:** All in `src/app/_components/` (underscore prefix = Next.js convention to exclude from routing)
- **File naming:** kebab-case for files, PascalCase for components
- **TypeScript:** Strict mode, `noUncheckedIndexedAccess` enabled
- **Unused vars:** Prefix with `_` (ESLint rule)
- **Prisma client output:** `generated/prisma/` (not default `node_modules`)
- **Widget settings:** Stored as untyped JSON in the database; cast on the client side

## Environment Variables

Required: `DATABASE_URL` (PostgreSQL connection string).
Optional: `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, `GEMINI_API_KEY`.
Validated via `@t3-oss/env-nextjs` in `src/env.js`. Set `SKIP_ENV_VALIDATION=true` for Docker builds.

## Related Repositories

This widget builder is part of the broader Freestand platform. The other repos:

### Freestand Frontend — `/home/sachita/Desktop/freestand/freestand`

Turborepo monorepo (pnpm@8.9.0, Next.js 14, Pages Router).

| App | Port | Purpose |
|-----|------|---------|
| sampling-central | 3000 | Main platform — campaigns, analytics, inventory |
| promoter | 3001 | Promoter-facing app |
| trysample | 3002 | Sample/trial experience |
| retailer | 3003 | Retailer management |
| ugcai | 3004 | AI-powered UGC management |

- **Shared packages:** `@freestand/prisma`, `@freestand/ui`, `@freestand/types`, `@freestand/eslint-config`, `@freestand/typescript-config`
- **Backend stack:** tRPC v10, NextAuth 4 (Credentials + Google + Azure AD), Prisma 5.9.1 (PostgreSQL + pgvector)
- **Frontend stack:** Zustand, Ant Design 5, Tailwind 3.4, Recharts/ECharts
- **Commands:** `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm prisma:generate`, `pnpm prisma:migrate-dev`

### Go Backend — `/home/sachita/Desktop/freestand/go-backend`

Go 1.25 microservice (Echo v4, SQLc + Bun ORM, PostgreSQL, Redis, SQS).

- **Runs in Docker:** `make run` (port 8080). Never use raw `go run/build`.
- **Entry:** `src/cmd/main.go`
- **Structure:** `src/api/handlers/` → `src/services/` (factory pattern) → `db/query/` (SQLc)
- **Key services:** Delivery (Shiprocket, Delhivery, Amazon), Communication (WhatsApp, SendGrid, Telegram), LLM (OpenAI, Anthropic, Grok), OTP, Shopify, Analytics (DuckDB), MCP server
- **Patterns:** StandardResponse `{success, message, data}`, outbox pattern for SQS, ambassador for external HTTP (circuit breaker)
- **Commands:** `make run`, `make build`, `make lint`, `make test`, `make sqlc-generate-claimant`, `make db-push`
