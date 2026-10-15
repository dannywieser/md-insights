# md-insights

Homelab TypeScript/Node project: loads markdown notes (a folder of `.md` files or a Bear DB) into a cache for analysis of content, relationships and structure. Currently only a hello world web app and a shared UI package exist; a service and a second (likely Electron) web app are planned.

## Commands

Run from the repo root with pnpm:

- `pnpm dev` - web app dev server (port 5173)
- `pnpm dev:design` - design viewer dev server (port 5174)
- `pnpm build` / `pnpm typecheck` / `pnpm test` - run across all workspaces
- `pnpm lint` - ESLint with typed rules
- `pnpm format` / `pnpm format:check` - Prettier

Before finishing a change, run `pnpm format`, `pnpm lint`, `pnpm typecheck` and `pnpm test`.

## Structure

- `apps/web` - React + Vite app (`@md-insights/web`)
- `apps/design` - design-board viewer for the theme tokens and shared components (`@md-insights/design`); display only, tokens live in `packages/ui`
- `packages/ui` - shared shadcn components, Solarized light/dark Tailwind v4 theme (Space Mono via `@fontsource`) and `cn` helper (`@md-insights/ui`); exports TypeScript source, no build step
- `create/` - logs and plans from `/create` sessions

New apps go in `apps/*`, shared code in `packages/*`.

## Conventions

- Tests live in a `tests/` folder beside `src/` in each workspace, never inside `src/`. Vitest + Testing Library + jsdom.
- Shared UI belongs in `packages/ui`; apps hold only app-specific code and import from `@md-insights/ui`.
- Add shadcn components with the CLI from `apps/web` (`pnpm dlx shadcn@latest add <name>`); they land in `packages/ui/src/components`. Export them from `packages/ui/src/index.ts` and run `pnpm format`. The CLI's generated components import `cn` from the `cn` package.
- Design decisions are recorded as guidelines on the design board (`apps/design/src/sections/Guidelines.tsx`); follow them in any UI: all text lowercase, square edges (every radius token is 0), cards with hard shadow and crop marks, grid paper page background. Change tokens in `packages/ui/src/styles/globals.css`, never per app. Update the guidelines list when a decision changes.
- The grid's minor line is `base02` in dark mode, the same as a card, so an element showing `bg-grid` on a card also needs `bg-background` or its minor lines vanish.
- Any app that uses the UI package needs `@source` for `packages/ui/src` in its CSS so Tailwind sees the class names.
- TypeScript is pinned to 6.0.x because typescript-eslint does not support TypeScript 7. Do not upgrade `typescript` until it does.
- Prettier: no semicolons, single quotes, trailing commas, 100 columns. 2-space indent, LF.
- Don't commit unless asked.
