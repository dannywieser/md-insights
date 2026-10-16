# plan: bootstrap electron app

## Goal

Add a new Electron desktop app, `apps/electron`, that opens a window rendering the shared `@md-insights/ui` theme and proves the whole stack with a tiny feature: choose a folder, scan it recursively, show the number of `.md` files. The feature lays the typed-IPC foundation (renderer -> preload -> main and a main -> renderer progress event) that later work will build on to load notes from disk and upload them to the planned cache service. This first implementation doubles as the spike that confirms electron-vite fits the repo.

## Scope

In:

- New workspace `apps/electron` (`@md-insights/electron`) built with electron-vite, React 19 and the shared UI package.
- Hardened window: `contextIsolation` on, `nodeIntegration` off, `sandbox` on.
- One shared, typed IPC contract used by main, preload and renderer; exposed as `window.api`.
  - `pickFolder()` -> `string | null` (native folder dialog).
  - `scanFolder(path)` -> `{ mdCount: number }` (recursive, `.md` only, skips dot-directories and `node_modules`).
  - `onScanProgress(cb)` -> unsubscribe function; main pushes `{ dirs, mdFiles }` while scanning.
- Hello-world UI: header, a "choose folder" button, the chosen path, live progress, the final count. Follows the design guidelines (lowercase text, square edges, hard-shadow cards).
- `demo/` folder at the repo root with ~18 committed markdown notes (nested topic folders, cross-note links, non-`.md` files and a `.hidden/` directory to exercise the filter).
- Root script `pnpm dev:electron`.
- Tests: the scan function against `demo/`, and the renderer UI with a stubbed `window.api`.

Out:

- Packaging, signing and installers (electron-builder or Forge later); window icon.
- Reading note contents, parsing, the cache service, upload.
- `NoteGrid` or other web-app content in the renderer.
- Persisting the chosen folder, menus, multiple windows, auto-update.

## Technologies

- **Electron** - desktop shell.
- **electron-vite** - dev server with HMR for the renderer, automatic rebuild and restart for main and preload, one config for all three targets. Build and dev tooling only; app code uses plain Electron APIs, so it is swappable.
- **React 19, Tailwind v4, `@md-insights/ui`** - same stack as `apps/web`, so the theme and guidelines carry over.
- **Vitest + Testing Library + jsdom** - per repo convention; `tests/` folder beside `src/`.
- TypeScript stays on 6.0.x (repo pin).

## Repository structure

```
apps/electron/
  package.json
  electron.vite.config.ts
  vitest.config.ts
  tsconfig.json            # solution file: references the two below
  tsconfig.node.json       # main, preload, shared (node types)
  tsconfig.web.json        # renderer, shared, tests (dom + vitest types)
  src/
    shared/ipc.ts          # channel names, payload types, the Api interface
    main/index.ts          # app lifecycle, BrowserWindow
    main/ipc.ts            # registers handlers (dialog, scan, progress push)
    main/scan.ts           # scanMarkdown(root, onProgress) - pure fs logic
    preload/index.ts       # contextBridge.exposeInMainWorld('api', ...)
    renderer/index.html
    renderer/src/main.tsx
    renderer/src/App.tsx
    renderer/src/env.d.ts  # declares window.api
    renderer/src/index.css
  tests/
    scan.test.ts
    App.test.tsx
    setup.ts
demo/
  README.md
  projects/...   journal/...   reference/...   .hidden/...
```

## Files

Create:

- `apps/electron/package.json` - workspace manifest; scripts `dev`, `build`, `preview`, `typecheck`, `test`; deps `electron`, `electron-vite`, `@md-insights/ui`, react, plus the test and Tailwind dev deps matching `apps/web` versions.
- `apps/electron/electron.vite.config.ts` - main/preload/renderer sections, react + tailwind plugins on the renderer, `@` alias.
- `apps/electron/vitest.config.ts` - jsdom, globals, `tests/**` include, setup file.
- `apps/electron/tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json` - project references so main/preload get node types and the renderer gets DOM types, never both.
- `apps/electron/src/shared/ipc.ts` - the single source of truth for channels and types.
- `apps/electron/src/main/index.ts` - creates the window with hardened webPreferences, loads the dev URL or built file, quits on window close (non-mac).
- `apps/electron/src/main/ipc.ts` - `ipcMain.handle` for pick and scan, validates the path argument, forwards progress with `webContents.send`.
- `apps/electron/src/main/scan.ts` - recursive async walk with `fs.readdir({ withFileTypes })`, skips dot-directories and `node_modules`, counts `.md`, calls a throttled `onProgress`.
- `apps/electron/src/preload/index.ts` - builds `window.api` from the shared interface; `onScanProgress` wraps `ipcRenderer.on` and returns an unsubscribe.
- `apps/electron/src/renderer/index.html`, `src/main.tsx`, `src/App.tsx`, `src/env.d.ts`, `src/index.css` - the UI (css imports `@md-insights/ui/globals.css` and has the `@source` for `packages/ui/src`).
- `apps/electron/tests/scan.test.ts`, `App.test.tsx`, `setup.ts`.
- `demo/**` - ~18 `.md` notes across `projects/`, `journal/`, `reference/` (a nested level or two), a few `[[wikilinks]]`/relative links, a `.txt` and an `.svg`, a `.hidden/` dir with a note, and a `demo/README.md` stating the expected counts.

Modify:

- `package.json` (root) - add `"dev:electron": "pnpm --filter @md-insights/electron dev"`.
- `pnpm-workspace.yaml` - allow the install scripts `electron` (binary download) and `esbuild` need under pnpm 10 (`onlyBuiltDependencies`), if the install shows they are blocked.
- `pnpm-lock.yaml` - updated by install.
- `CLAUDE.md` / `README.md` - done at `/create-complete`, not during implementation.

## Steps

1. **Scaffold the workspace** - `apps/electron` manifest, tsconfigs, electron-vite and vitest configs; `pnpm install`; fix pnpm build-script approval for electron if needed; add `dev:electron`. Done when `pnpm install` succeeds and the electron binary is present.
2. **Demo notes** - create `demo/` (18 counted `.md` files, the extras, `.hidden/`, README with expected counts).
3. **Shared IPC contract and scan logic** - `shared/ipc.ts`, `main/scan.ts`, plus `tests/scan.test.ts` asserting the demo count (and that `.hidden/`, `.txt`, `.svg` are ignored) and that progress is reported.
4. **Main and preload** - `main/index.ts`, `main/ipc.ts`, `preload/index.ts`; hardened window; path validation.
5. **Renderer** - `index.html`, `main.tsx`, `index.css`, `env.d.ts`, `App.tsx` (button, path, progress, count) using `AppHeader`, `Card` and `Button` from the UI package; `tests/App.test.tsx` with a stubbed `window.api`.
6. **Run it** - `pnpm dev:electron`, pick `demo/`, confirm the count and progress show; check the console for errors; take a screenshot if possible.
7. **Gate** - `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Open questions / risks

- **pnpm + Electron**: pnpm 10 blocks dependency install scripts by default, so the Electron binary may not download until it is allowed (step 1). Electron with pnpm's symlinked `node_modules` sometimes needs `shamefully-hoist`/`node-linker=hoisted`; try without first and only add it if the app fails to start.
- **TypeScript project references vs ESLint's `projectService`**: the two-tsconfig layout may not be picked up by typed linting. Fallback: a single `tsconfig.json` with both node and DOM types (less strict, simpler).
- **Version compatibility**: electron-vite must support Vite 8 and the pinned TypeScript 6.0.x; if not, pin the Vite version for this workspace or adjust. Versions are pinned exactly like the other workspaces; the latest compatible ones are chosen at install time.
- **Renderer path argument**: `scanFolder` accepts a path from the renderer. It only returns a count, so the exposure is small, but it is validated (string, absolute, a directory). Later, when file contents are read, main should only accept paths it handed out from the picker.
- **Progress throttling**: events are throttled (for example every 50 ms) so a large tree cannot flood IPC.
- **First-time tooling**: this implementation is the spike; if electron-vite fits badly, only config and scripts change, not the app code.
