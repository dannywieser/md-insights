# Plan: generated api client

_Revised 2026-10-16 17:25: the cache now validates with zod and emits its own OpenAPI spec; the client is generated from that spec._

## Goal

Make the note cache the single source of truth for its API contract, and generate everything else from it. The cache's routes and validators are rewritten with zod (`@hono/zod-openapi`); a script emits `apps/cache/openapi.json` from those routes (committed); `packages/api-client` (`@md-insights/api-client`) generates a typed fetch SDK, zod schemas that validate requests and responses, and TanStack Query hooks from that spec with hey-api. The web app uses the client; Electron can use the SDK later. Generated client output is gitignored and built on demand. The aim is to have this in place before adding more endpoints or APIs, so every future client starts with schema validation built in.

## Scope

In:

- `apps/cache`: replace the hand-written validators in `src/app.ts` with zod schemas and `createRoute` definitions (`@hono/zod-openapi`), keeping behaviour and the `{ error }` 400 shape.
- `apps/cache`: a script that writes `openapi.json` from the routes; the file is committed; a test fails if it is stale.
- `packages/api-client`: hey-api config, `generate` script, thin hand-written entry per API, tests.
- Root script wiring so `typecheck`, `lint`, `test` and `build` have generated code present.
- Web app: `QueryClientProvider`, base URL from `VITE_CACHE_URL`, dependency. Replacing the fake grid data with cache data is **not** part of this.
- Docs: `apps/cache/README.md`, `packages/api-client/README.md`, `CLAUDE.md`.

Out:

- Wiring real cache data into the web app or Electron.
- Changing the cache's API shape, storage or `store.ts`.
- Publishing, auth, retries.

## Technologies

- `zod` and `@hono/zod-openapi` (in `apps/cache`): zod validators and OpenAPI generation from one definition. Runs under Node type stripping, so no build step and no generated code is needed at server runtime.
- `@hey-api/openapi-ts` with plugins `@hey-api/typescript`, `@hey-api/sdk` (`validator: true`), `zod` and `@tanstack/react-query`, plus its fetch client: generator for `packages/api-client`.
- `@tanstack/react-query` (peer dependency of the package, dependency of the web app).
- Versions are pinned at install time to the latest compatible; the hey-api zod plugin and `@hono/zod-openapi` must agree on the zod major.

## Repository structure

```
apps/cache/
  openapi.json                    new, committed, generated from the routes
  scripts/generate-openapi.ts     new, writes openapi.json
  src/schemas.ts                  new, zod schemas (ids, fields, notes, errors)
  src/app.ts                      rewritten with OpenAPIHono + createRoute
  tests/api.test.ts               existing behaviour tests stay green
  tests/openapi.test.ts           new, committed spec equals generated spec
packages/api-client/
  package.json
  tsconfig.json
  openapi-ts.config.ts            one entry per API
  README.md
  src/
    cache/index.ts                hand-written entry: re-exports generated + configureCacheClient()
    generated/                    gitignored output, one folder per API
      cache/
  tests/
    cache.test.ts
apps/web/
  src/main.tsx                    QueryClientProvider + configure client
  src/query-client.ts             new, shared QueryClient
  src/vite-env.d.ts (or similar)  VITE_CACHE_URL typing
.gitignore, .prettierignore, eslint.config.js   ignore generated dir
package.json (root)               scripts changed
```

## Files

- `apps/cache/src/schemas.ts`: zod schemas for names (non-empty, no `/`), fields, note input, upsert body, list query (`fields`), list/get/health/error responses.
- `apps/cache/src/app.ts`: `OpenAPIHono` app with `createRoute` per endpoint (`PUT /notes`, `GET /notes`, `GET /notes/{id}`, `DELETE /notes/{id}`, `GET /health`); a default validation hook that returns `{ error }` with 400 and a readable message; body limit and CORS kept.
- `apps/cache/scripts/generate-openapi.ts`: builds the app with a throwaway in-memory store and writes `openapi.json` (stable key order, trailing newline).
- `apps/cache/openapi.json`: committed OpenAPI 3.1 document.
- `apps/cache/package.json`: add `zod`, `@hono/zod-openapi`; scripts `openapi` (writes the spec).
- `apps/cache/tests/openapi.test.ts`: fails when `openapi.json` differs from what the routes produce.
- `packages/api-client/package.json`: exports `./cache`; scripts `generate`, `typecheck`, `test`; peer deps react, `@tanstack/react-query`.
- `packages/api-client/openapi-ts.config.ts`: array of configs, each `{ input: <spec path>, output: src/generated/<api>, plugins }`; the cache entry points at `../../apps/cache/openapi.json`.
- `packages/api-client/src/cache/index.ts`: re-exports SDK, schemas, types and hooks; `configureCacheClient({ baseUrl })`.
- `packages/api-client/tests/cache.test.ts`: generated schemas accept and reject sample payloads, and the SDK/hooks exist (smoke test that generation ran).
- `apps/web/src/query-client.ts`, `main.tsx`, env typing: provider and `VITE_CACHE_URL` (default `http://localhost:8787`).
- `apps/web/package.json`: add `@md-insights/api-client`, `@tanstack/react-query`.
- Root `package.json`: `generate` script; `typecheck`, `test`, `build` and `lint` run it first (explicit script, no `postinstall`).
- `.gitignore`, `.prettierignore`, `eslint.config.js`: ignore `packages/api-client/src/generated/`.
- `CLAUDE.md`, `apps/cache/README.md`, `packages/api-client/README.md`: document the flow (routes -> `openapi.json` -> client) and the commands.

## Steps

Each step is a pause point.

1. Cache: add `zod` and `@hono/zod-openapi`; write `src/schemas.ts`.
2. Cache: rewrite `src/app.ts` with `createRoute`; keep `tests/api.test.ts` green (same status codes and `{ error }` shape; update any test that pins message text).
3. Cache: `scripts/generate-openapi.ts`, `pnpm --filter @md-insights/cache openapi`, commit-ready `openapi.json`, and `tests/openapi.test.ts`.
4. Scaffold `packages/api-client` (package.json, tsconfig, ignore entries) and install dependencies.
5. Add `openapi-ts.config.ts` and the `generate` script; run it and inspect the output (types, SDK with validators, zod, hooks).
6. Add `src/cache/index.ts` with `configureCacheClient`, the package `exports` and `tests/cache.test.ts`.
7. Wire root scripts so generation runs before `typecheck`, `lint`, `test`, `build`; update eslint/prettier ignores.
8. Web app: dependencies, `QueryClientProvider`, base URL config and env typing; existing tests stay green.
9. Docs: READMEs and `CLAUDE.md` conventions.
10. Run `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Open questions / risks

- **Spec format:** `openapi.json` rather than YAML, since it is machine-written and avoids a YAML dependency. Easy to change.
- **`GET /notes?fields=a,b` query:** a comma-separated string. Keep it a plain string in the spec and split it in the handler (or a transform); verify `@hono/zod-openapi` documents it cleanly.
- **Dynamic note keys:** list rows are `{ id, ...fields }`, so the schema is an object with required `id` and `additionalProperties: string`. Generated types are loose for the fields; acceptable.
- **Error messages:** free to change. Usage is low, so the 400 `{ error }` shape stays but the message text may become whatever zod produces (formatted by the default hook); tests and README are updated to match.
- **Response validation on `GET /notes`:** validating thousands of rows with zod on every call may be slow. Validation stays on everywhere (decision); measure with a few thousand rows and make list validation switchable only if it matters.
- **Type stripping:** `@hono/zod-openapi` must work under Node's type stripping with `.ts` imports; erasable syntax only in the cache code.
- **Fresh clone:** the client does not exist until `pnpm generate` runs; root scripts run it first, but a workspace script run directly needs it done once. Documented.
- **Spec drift:** now caught by `openapi.test.ts` (committed spec vs routes); the client always regenerates from the committed spec.
