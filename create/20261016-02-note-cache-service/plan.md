# plan: note cache service

## Goal

Add `apps/cache`, a small HTTP service that stores notes as per-note string fields and serves them back for visualization. The Electron app (later) scans local notes and pushes them incrementally; the web app (later) reads a light listing for the grid and fetches the full note on demand. This session builds the service only, running locally with SQLite as the store. Storage is shaped so generic key/value entries and sets can be layered on later without touching the notes API.

## Scope

In:

- New workspace `apps/cache` (`@md-insights/cache`): Hono on Node, SQLite file store.
- Notes API (no auth, no pagination, open CORS):
  - `PUT /notes` - batch upsert; the client supplies IDs. Fields named in the payload are written, other stored fields of that note are left alone. The service also stamps the reserved field `synced` (ISO 8601 UTC time of the upsert) on every note in the batch; a client-sent `synced` is overwritten. It is the only field the service writes itself.
  - `DELETE /notes/:id` - remove a note and all its fields (idempotent, `204`).
  - `GET /notes?fields=title,synced` - the listed fields for every note, grouped by ID. `fields` is required so a bulk call can never ship every body by accident.
  - `GET /notes/:id` - all fields of one note, body included; `404` if unknown.
  - `GET /health` - liveness.
- Storage keyed `<id>/<field>` conceptually (two columns in SQLite); values are strings; fields are free-form (`title`, `body` first; the grid colour field later needs no schema change), except `synced`, which is server-stamped.
- Config by env: `PORT` (default `8787`), `CACHE_DB` (default `apps/cache/data/cache.db`, `:memory:` allowed).
- Tests (store and HTTP) and a README with a curl walkthrough using the garden demo notes.
- Root script `pnpm dev:cache`; CLAUDE.md updated with the new app and its commands.

Out:

- Docker / compose / homelab deployment (deferred; SQLite keeps it a single file and container later).
- Wiring Electron (upload) and the web app (fetch) to the service.
- Generic entries (`totalnotes` style), sets (folders, tags, last synced), auth, pagination, search, rate limits.
- Computing IDs or titles (the client's job); the service stores what it is given, apart from stamping `synced`. A file-modified time, if wanted, is a separate client field.

## Technologies

- **Hono + `@hono/node-server`** - chosen by the user; tiny, typed, and `app.request()` makes HTTP tests need no real socket.
- **`node:sqlite`** (built into Node 24, repo requires `>=24`) - zero dependencies and no native build step. Using `better-sqlite3` would need a native build and a pnpm build-script allowlist, which the repo recently dropped. `node:sqlite` is still flagged experimental (prints a warning), see risks. All access sits behind one `store` module, so swapping the driver is a one-file change.
- **Node's native TypeScript stripping** to run (`node --watch src/index.ts`), so no build step or `tsx`; code must be erasable syntax only (no enums or namespaces) and use `.ts` import extensions.
- **Vitest** (node environment) - per repo convention, tests in `tests/` beside `src/`.
- TypeScript stays on 6.0.x (repo pin). New dependency versions pinned exactly, like the rest of the repo.

## Repository structure

```
apps/cache/
  package.json
  tsconfig.json
  vitest.config.ts
  README.md              # run, configure, curl walkthrough
  .gitignore             # data/
  src/
    store.ts             # createStore(path): SQLite schema + note operations
    app.ts               # createApp(store): Hono routes, validation, CORS
    index.ts             # reads env, opens store, serves
  tests/
    store.test.ts
    api.test.ts
```

## Files

Create:

- `apps/cache/package.json` - scripts `dev` (`node --watch src/index.ts`), `start`, `typecheck`, `test`; deps `hono`, `@hono/node-server`; devDeps `@types/node`, `vitest`.
- `apps/cache/tsconfig.json` - extends base; `lib: ["ES2023"]`, `types: ["node", "vitest/globals"]`, `allowImportingTsExtensions`, `erasableSyntaxOnly`; includes `src`, `tests`, `vitest.config.ts`.
- `apps/cache/vitest.config.ts` - node environment, globals, `tests/**/*.test.ts`.
- `apps/cache/.gitignore` - `data/` (the SQLite file).
- `apps/cache/src/store.ts` - table `note_fields(note_id TEXT, field TEXT, value TEXT, PRIMARY KEY (note_id, field)) WITHOUT ROWID`; `upsertNotes`, `deleteNote`, `listNotes(fields)`, `getNote(id)`; upserts run in one transaction and stamp `synced` with one timestamp per batch; WAL mode.
- `apps/cache/src/app.ts` - routes above; validation: IDs and field names are non-empty strings without `/`, values are strings, bad input gives `400` with `{ error }`; body size limit raised for large bodies; `hono/cors` open.
- `apps/cache/src/index.ts` - env config, creates the data dir, starts the server, logs the URL.
- `apps/cache/tests/store.test.ts` - store behaviour against `:memory:`, including `synced` being stamped on insert and update and overriding a client value.
- `apps/cache/tests/api.test.ts` - routes via `app.request()`.
- `apps/cache/README.md` - how to run, env vars, endpoint reference, curl walkthrough.

Modify:

- `package.json` (root) - add `"dev:cache": "pnpm --filter @md-insights/cache dev"`.
- `CLAUDE.md` - mention the cache app in the intro, Commands (`pnpm dev:cache`, port) and Structure; note the `node:sqlite` and native-TS-stripping conventions.
- `pnpm-lock.yaml` - updated by install.

## Steps

1. Scaffold the workspace: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`; add the root `dev:cache` script; `pnpm install`.
2. `src/store.ts` with its tests: schema, batch upsert (merge semantics), delete, list by fields (omit missing fields, omit notes with none of the fields), get one.
3. `src/app.ts` with HTTP tests: each route, validation errors, `404`, CORS header, `fields` required, merge semantics over HTTP.
4. `src/index.ts`: env config and server; run it for real and exercise it with curl.
5. `README.md` with the curl walkthrough (put `plan` and `plants` garden notes, list titles and `synced`, get one, update a title only, delete); run every command in it once to prove it works.
6. Update `CLAUDE.md`.
7. Run `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`; fix issues.

## Open questions / risks

- `node:sqlite` is experimental in Node 24 (API could change, a warning prints on start). Mitigated by isolating it in `store.ts`; if it proves troublesome, `better-sqlite3` is the fallback.
- Native TS stripping does not typecheck and rejects non-erasable syntax; `pnpm typecheck` covers the first and `erasableSyntaxOnly` the second.
- The reserved `synced` name is the one place the service is not generic; it is a single constant in `store.ts`, easy to widen if more server-managed fields appear.
- `GET /notes?fields=...` returns a single JSON object keyed by ID; fine at the sizes discussed (thousands of notes, light fields). Revisit pagination or streaming only if payloads grow.
- Client-supplied IDs mean a colliding ID overwrites another note's fields; the Electron side must derive IDs from something stable and unique (e.g. a path hash).
- No auth: acceptable for local use, but must be addressed before exposing it on the homelab network.
