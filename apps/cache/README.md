# cache

A small HTTP service that stores notes as per-note string fields (SQLite) and serves them back for the web app. The Electron app pushes notes to it incrementally.

## Run

From the repo root:

```bash
pnpm dev:cache
```

| env        | default                    | meaning                                      |
| ---------- | -------------------------- | -------------------------------------------- |
| `PORT`     | `8787`                     | listen port                                  |
| `CACHE_DB` | `apps/cache/data/cache.db` | SQLite file (`:memory:` for a throwaway run) |

Node prints an `ExperimentalWarning` for `node:sqlite` on start; that is expected.

## API

A note is an `id` (chosen by the client) plus string fields such as `title` and `body`. IDs and field names are non-empty and must not contain `/`.

| request                       | does                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `PUT /notes`                  | upsert a batch: `{ "notes": [{ "id": "...", "fields": { "title": "..." } }] }`                                 |
| `GET /notes?fields=title,...` | an array of `{ "id", "fields": { ... } }` with only the requested fields, ordered by id (`fields` is required) |
| `GET /notes/:id`              | all fields of one note as `{ "fields": { ... } }`, `404` if unknown                                            |
| `DELETE /notes/:id`           | remove a note, `204` even if it did not exist                                                                  |
| `GET /health`                 | `{ "ok": true }`                                                                                               |

`PUT` only writes the fields it names; other stored fields of that note are kept. The service stamps `synced` (ISO 8601 UTC time of the upsert) on every upserted note and overwrites any `synced` the client sends. Errors are `{ "error": "..." }` with `400` for bad input.

## Try it with curl

Start the service in one terminal (`pnpm dev:cache`), then in another:

```bash
BASE=http://localhost:8787

# 1. push two garden notes
curl -X PUT $BASE/notes -H 'content-type: application/json' -d '{
  "notes": [
    { "id": "abc123", "fields": { "title": "plan", "body": "raised beds along the south fence" } },
    { "id": "def456", "fields": { "title": "plants", "body": "tomatoes, beans, basil" } }
  ]
}'

# 2. list titles and sync times (what the grid loads, no bodies)
curl "$BASE/notes?fields=title,synced"

# 3. fetch one whole note
curl $BASE/notes/abc123

# 4. change only a title; the body is kept and synced is refreshed
curl -X PUT $BASE/notes -H 'content-type: application/json' -d '{
  "notes": [{ "id": "abc123", "fields": { "title": "garden plan" } }]
}'
curl $BASE/notes/abc123

# 5. delete a note
curl -i -X DELETE $BASE/notes/def456
curl -i $BASE/notes/def456   # 404

# 6. missing fields is rejected
curl -i "$BASE/notes"        # 400
```

To start over, stop the service and delete `apps/cache/data/`.
