# Plan: repo bootstrap

## Goal

Bootstrap `md-insights`, a homelab TypeScript/Node project that will load markdown notes (a folder of `.md` files or a Bear DB) into a cache for analysis of content, relationships and structure. This session sets up a pnpm monorepo with a web app and a shared UI package (shadcn components and theming) that a second web app (likely Electron-based) will reuse later. The web app is a hello world inside a shadcn `Card`, with linting, testing, a README and a `CLAUDE.md`.

## Scope

**In**
- pnpm workspace with `apps/web` and `packages/ui`
- `packages/ui` (`@md-insights/ui`): shadcn components (`button`, `card`), `cn` util, Tailwind v4 theme and global styles (light/dark CSS variables)
- `apps/web`: React + TypeScript + Vite, consuming `@md-insights/ui`; hello world page in a `Card` (no default Vite demo content)
- ESLint (flat config) + Prettier, Vitest + Testing Library + jsdom with smoke tests
- Node LTS pin, `.gitignore`, `.editorconfig`, README, `CLAUDE.md`

**Out**
- Any service / backend, markdown parsing, cache, Bear integration
- The second (Electron) app itself; only the shared package that enables it
- CI, Turborepo/Nx, Docker, publishing the UI package

## Technologies

| Tool | Why |
| --- | --- |
| pnpm workspaces | Chosen package manager; `apps/*` and `packages/*` |
| Node 24 LTS (`.nvmrc`, `engines`) | Matches installed runtime (v24.12.0) |
| React + TypeScript + Vite | Requested web stack |
| Tailwind v4 (`@tailwindcss/vite`) | Required by current shadcn |
| shadcn/ui (monorepo layout) | `components.json` in both `packages/ui` and `apps/web`; components live in the UI package |
| Just-in-time UI package | `@md-insights/ui` exports TS source directly (no build step); consuming Vite apps compile it. Simplest for Vite and Electron-Vite apps |
| TypeScript 6.0.x (pinned) | TS 7 is incompatible with typescript-eslint (see risks) |
| ESLint flat config + typescript-eslint + react-hooks, Prettier | Agreed lint/format setup |
| Vitest + Testing Library + jsdom | Agreed test setup |

## Repository structure

```
md-insights/
├── .editorconfig
├── .gitignore
├── .nvmrc
├── .prettierrc.json
├── .prettierignore
├── CLAUDE.md
├── README.md
├── eslint.config.js
├── package.json              # root: scripts, devDeps, engines
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── apps/
│   └── web/
│       ├── components.json   # shadcn config, aliases point at @md-insights/ui
│       ├── index.html
│       ├── package.json      # depends on @md-insights/ui (workspace:*)
│       ├── tsconfig.json
│       ├── vite.config.ts    # includes vitest config
│       ├── src/
│           ├── main.tsx
│           ├── App.tsx
│           └── index.css     # imports @md-insights/ui styles, @source for ui package
│       └── tests/
│           ├── setup.ts      # jest-dom matchers, cleanup
│           └── App.test.tsx
├── packages/
│   └── ui/
│       ├── components.json   # shadcn config
│       ├── package.json      # name @md-insights/ui, exports map
│       ├── tsconfig.json
│       ├── src/
│           ├── index.ts      # barrel exports
│           ├── styles/globals.css   # tailwind + theme variables (light/dark)
│           ├── lib/utils.ts         # cn()
│           └── components/{button,card}.tsx
│       └── tests/
│           └── card.test.tsx
└── create/                   # existing session logs
```

## Files

- `package.json` (root): private workspace; scripts `dev`, `build`, `lint`, `format`, `format:check`, `test`, `typecheck` (recursive over workspaces); shared devDeps.
- `pnpm-workspace.yaml`: declares `apps/*` and `packages/*`.
- `.nvmrc`, `engines` field: Node 24.
- `.gitignore`: node_modules, dist, coverage, `.env*`, `.DS_Store`, logs, `*.tsbuildinfo`.
- `.editorconfig`: UTF-8, LF, 2-space indent, final newline.
- `.prettierrc.json`, `.prettierignore`: formatting rules.
- `eslint.config.js`: flat config for TS/React, ignores build output.
- `tsconfig.base.json`: strict shared compiler options.
- `packages/ui/package.json`: exports `.` (components), `./styles/globals.css`, `./lib/utils`; peer deps on react.
- `packages/ui/src/styles/globals.css`: Tailwind import, `@theme` mapping, `:root` and `.dark` variables.
- `packages/ui/src/components/button.tsx`, `card.tsx`, `lib/utils.ts`, `index.ts`: shared components and util.
- `packages/ui/tests/card.test.tsx`: component smoke test (Vitest in the package). Tests live in a `tests/` folder beside `src/`, never inside it.
- Each workspace's `tsconfig.json` and Vitest config include both `src` and `tests`; ESLint covers `tests/` too.
- `apps/web/*`: the Vite app as laid out above. `App.tsx` renders a centered `Card` imported from `@md-insights/ui`; `tests/App.test.tsx` asserts it renders; `tests/setup.ts` is the Vitest setup file.
- `README.md`: what the project is, prerequisites, commands, layout, how to add shadcn components to the UI package, how a new app consumes it.
- `CLAUDE.md`: project overview, commands, conventions, structure, UI-package rules (shared components go in `packages/ui`, apps hold only app-specific code).

## Steps

1. Root workspace files: `package.json`, `pnpm-workspace.yaml`, `.nvmrc`, `.gitignore`, `.editorconfig`, `tsconfig.base.json`.
2. Create `packages/ui`: `package.json`, `tsconfig.json`, `components.json`, `cn` util, `globals.css` theme; add `button` and `card` via the shadcn CLI (work out any monorepo/alias issues so the CLI is usable going forward); barrel `index.ts`.
3. Scaffold `apps/web` by hand (not the Vite template): `package.json` (depends on `@md-insights/ui`), `index.html`, `tsconfig.json`, `vite.config.ts`, `main.tsx`, `index.css` (imports the UI globals and adds `@source` for the UI package); install React, Vite, Tailwind v4.
4. Write `App.tsx` hello world in a `Card` using `@md-insights/ui`.
5. Add ESLint and Prettier config; get `lint` and `format:check` passing.
6. Add Vitest, Testing Library, jsdom, `tests/setup.ts`, `tests/App.test.tsx` and the UI package's `tests/card.test.tsx`; get `test` passing in both.
7. Write `README.md` and `CLAUDE.md`.
8. Verify: `pnpm install`, `lint`, `typecheck`, `test`, `build`, then run the dev server and check the page in the browser, including dark mode, and confirm the shadcn CLI adds a test component from `apps/web` into `packages/ui` (then remove it).

## Open questions / risks

- The shadcn CLI must be made to work in the monorepo (required, no hand-written fallback): `components.json` in both `apps/web` and `packages/ui` with matching aliases (`ui` → `@md-insights/ui/components`, `utils` → `@md-insights/ui/lib/utils`, `components`/`lib`/`hooks` per the shadcn monorepo docs), `tailwind.css` pointing at the shared globals, and the same `style`/`baseColor`/`iconLibrary` in both. Step 2 includes diagnosing and fixing any CLI problems, and step 8 verifies `pnpm dlx shadcn@latest add <component>` run from `apps/web` lands files in `packages/ui`.
- Tailwind v4 must scan the UI package's source: handled with an `@source` directive in the app's CSS. An Electron app later needs the same.
- Just-in-time (no build) UI package is assumed; if you prefer a built package (tsup/vite lib mode), say so.
- TypeScript 7 (Go-native, `latest` on npm is 7.0.2) has no stable programmatic API, and typescript-eslint 8.71.2 declares `typescript: >=4.8.4 <6.1.0`, so typed linting cannot run on TS 7. Decision: pin `typescript` to the latest 6.0.x (`~6.0`) for the whole repo, and revisit once TS 7.1 ships its API and typescript-eslint adds support. Optional later: add `@typescript/native-preview`/`tsgo` as a separate fast typecheck.
- Package scope `@md-insights` confirmed.
- Node 24 is assumed to be the LTS line; `.nvmrc` will use `24`.
- Nothing is committed unless you ask.
