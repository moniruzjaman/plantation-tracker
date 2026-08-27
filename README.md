# PMIS V2 — KrishiAI Field Platform

**Plantation Management Information System Version 2.0**

A modern, offline-first field platform built with Turborepo, Hono, React, and Drizzle ORM.

## Structure

```
pmis-v2/
├── apps/
│   └── web/          # React + Vite web app
├── packages/
│   ├── ui/           # shadcn/ui components
│   ├── types/        # Shared TypeScript types
│   ├── geo/          # GPS utilities
│   ├── gis/          # Maps + Bangladesh boundaries
│   ├── db/           # Drizzle ORM + Turso
│   ├── auth/         # JWT + RBAC
│   ├── ai/           # AI waterfall + providers
│   └── sync/         # Offline sync engine
├── workers/
│   └── api/          # Cloudflare Workers (Hono)
└── turbo.json
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all dev servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Tech Stack

- **Frontend**: React 19, Vite 6, TypeScript, Tailwind CSS 4
- **Backend**: Hono, Cloudflare Workers, Drizzle ORM
- **Database**: Turso (SQLite)
- **Maps**: MapLibre GL JS
- **Offline**: Dexie.js, Service Workers
- **AI**: Gemini, OpenRouter, Groq waterfall

## Phases

- **Phase 0**: Monorepo Foundation (Weeks 1-2)
- **Phase 1**: Core Field Modules (Weeks 3-6)
- **Phase 2**: Intelligence Layer (Weeks 7-10)
- **Phase 3**: Administration & Reporting (Weeks 11-13)
- **Phase 4**: Mobile & PWA (Weeks 14-15)
- **Phase 5**: Hardening & Deployment (Week 16)

## License

MIT
