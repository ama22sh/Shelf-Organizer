# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### book-stacker (web)
Cozy library-themed 2D drag-and-drop puzzle game. Frontend-only (React + Vite, wouter routing, framer-motion animations, lucide-react icons, localStorage progress).

- 12 progressive levels in `src/game/levels.ts` (tutorial → multi-shelf → blocked cells → fragile/heavy/rotatable → time/move limits)
- Game logic & placement validation in `src/game/gameLogic.ts`
- Components: `Book`, `Shelf`, `BookTray`, `HUD`, `CompleteOverlay`
- Pages: `Title`, `LevelSelect`, `Game`, `HowToPlay`, `Settings`
- Game state managed via `useReducer` in `pages/Game.tsx`
- Progress + settings persisted via `src/lib/storage.ts` under key `book-stacker-progress-v1`
- Theme: warm mahogany / amber / oxblood, dark mode default, both modes supported
- Keyboard: `R` rotate, `Esc` restart, `Ctrl/⌘+Z` or `U` undo
