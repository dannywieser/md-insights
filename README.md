# md-insights

A homelab project that loads markdown notes (a folder of `.md` files or a Bear database) into a cache so their content, relationships and structure can be analyzed.

Currently a bootstrap: a pnpm monorepo with a hello world web app and a shared UI package.

## Prerequisites

- Node 24 (`nvm use` reads `.nvmrc`)
- pnpm 10 (`corepack enable` picks up the pinned version)

## Getting started

```bash
pnpm install
pnpm dev
```

## Commands

Run from the repo root.

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start the web app dev server         |
| `pnpm build`        | Typecheck and build every workspace  |
| `pnpm typecheck`    | Run `tsc` in every workspace         |
| `pnpm test`         | Run Vitest in every workspace        |
| `pnpm lint`         | Run ESLint (typed rules) on the repo |
| `pnpm format`       | Format with Prettier                 |
| `pnpm format:check` | Check formatting without writing     |

## Layout

```
apps/web/        React + Vite web app
packages/ui/     @md-insights/ui: shared shadcn components, theme and styles
```

Each workspace keeps its tests in a `tests/` folder beside `src/`. New apps go in `apps/*`, new shared packages in `packages/*`.

## Shared UI package

`@md-insights/ui` ships TypeScript source with no build step; each consuming Vite app compiles it. The theme (light and dark CSS variables) lives in `packages/ui/src/styles/globals.css`.

An app consumes it by:

1. Adding the dependency: `"@md-insights/ui": "workspace:*"`.
2. Importing the styles and telling Tailwind to scan the package in its CSS:

   ```css
   @import '@md-insights/ui/globals.css';
   @source '../../../packages/ui/src';
   ```

3. Importing components: `import { Button, Card } from '@md-insights/ui'`.

### Adding shadcn components

Run the CLI from an app (`apps/web` has a `components.json` whose `ui` alias points at the UI package):

```bash
cd apps/web
pnpm dlx shadcn@latest add dialog
```

Files land in `packages/ui/src/components`. Export the new component from `packages/ui/src/index.ts`, then run `pnpm format`.

## TypeScript version

TypeScript is pinned to 6.0.x. TypeScript 7 (the native compiler) has no stable programmatic API yet, so typescript-eslint cannot run on it. Revisit once TypeScript 7.1 and typescript-eslint support land.
