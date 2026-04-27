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
- Game logic & placement validation in `src/game/gameLogic.ts`, including `anyBookFits` for auto game-over when no remaining book has any legal spot
- Components: `Book`, `Shelf`, `BookTray`, `HUD`, `CompleteOverlay`, `AmbientDust`
- Pages: `Title`, `LevelSelect`, `Game`, `HowToPlay`, `Settings`
- Game state managed via `useReducer` in `pages/Game.tsx`
- Progress + settings persisted via `src/lib/storage.ts` under key `book-stacker-progress-v1`
- Theme: warm mahogany / amber / oxblood, dark mode default, both modes supported
- Interaction: hybrid drag-and-drop + click-to-place. A floating ghost follows the cursor while dragging; cells highlight green for valid / red for invalid in real time. A pure tap (no movement) keeps the book held for click-to-place.
- Audio: `src/lib/audio.ts` is a singleton `WebAudio` engine. All sounds are synthesized (no embedded files). Effects: pick, place, invalid, perfect, win, lose. Background music is a gentle 4-voice drone with a slow LFO swell that starts on the first user gesture.
- Ambient: floating dust motes, subtle camera-breathe scaling, wooden cupboard frames with crown/base lips, books rendered with stacked-segment dividers, gradient spines, gold edge caps, and slight per-id tilt.
- `CozyRoom` background renders an SVG reading-room scene behind gameplay: warm window with mullions and curtains, flickering floor lamp halo, indoor plant, side table with steaming teacup and a small book stack, plus a vignette.
- Drag placement uses an offset-aware probe: the floating ghost is centered on the cursor, and `elementsFromPoint` is called at `(cursor - ((W-1)/2, (H-1)/2)*cellSize)` so the ghost's top-left cell index matches the placed position exactly. This eliminates the off-by-one snap for any multi-cell book.
- Keyboard: `R` rotate, `Esc` restart, `Ctrl/⌘+Z` or `U` undo

## Story Mode + Kids Mode (added)
- New routes: `/library`, `/read/:id`, `/kids`, `/kids/listen`, `/kids/quiz`
- Story content in `src/story/stories.ts` — 10 hand-written short stories across 6 categories (adventure, mystery, history, science, fantasy, motivational), 7 daily facts, and a 12-question kids quiz bank. Free vs premium stories; premium unlocked with coins.
- `pickDaily()` deterministically chooses today's story or fact from a date seed; rendered on Title and Library as "Today's pick" with a +5 coin daily claim button (streak tracked).
- `src/lib/economy.ts` — separate localStorage namespace `book-stacker-economy-v1` for coins, unlocked stories, story page progress, daily streak, and quiz stats.
- `StoryReader` shows a 3D-perspective hardcover with a parchment two-page spread, animated page-flip rotateY, drop-cap first letter, page numbers, click zones for paging on mobile, keyboard arrows, and a coin reward on first finish per story.
- `Kids` is a separate, brighter section with pastel `kids-bg`, large rounded cards, friendly typography. `KidsListen` uses the browser's `window.speechSynthesis` to narrate stories with live word highlighting; `KidsQuiz` is a 5-question fill-in-the-blank round with cheerful/correct hint sounds and a results screen awarding 1 coin per correct.
- New audio in `audio.ts`: `bookOpen` (filtered noise sweep + warm sine), `pageFlip` (high-passed noise rustle), `correct` (rising triangle arpeggio), `wrong` (gentle descending sine), plus the existing button `click` global hook.
