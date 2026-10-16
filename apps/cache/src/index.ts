import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { serve } from '@hono/node-server'
import { createApp } from './app.ts'
import { createStore } from './store.ts'

const port = Number(process.env.PORT ?? 8787)
const dbPath = process.env.CACHE_DB ?? resolve(import.meta.dirname, '../data/cache.db')

if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true })

const store = createStore(dbPath)
const server = serve({ fetch: createApp(store).fetch, port }, (info) => {
  console.log(`cache listening on http://localhost:${info.port} (db: ${dbPath})`)
})

function shutdown() {
  server.close()
  store.close()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
