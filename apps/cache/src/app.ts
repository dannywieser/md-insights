import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import type { NoteInput, Store } from './store.ts'

const MAX_BODY_BYTES = 64 * 1024 * 1024

class BadRequest extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** IDs and field names are joined as `<id>/<field>`, so they are non-empty and slash-free. */
function isName(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && !value.includes('/')
}

function parseNotes(payload: unknown): NoteInput[] {
  if (!isRecord(payload) || !Array.isArray(payload.notes)) {
    throw new BadRequest('body must be { "notes": [{ "id": string, "fields": { name: string } }] }')
  }
  return payload.notes.map((note: unknown, index) => {
    if (!isRecord(note) || !isName(note.id)) {
      throw new BadRequest(`notes[${index}].id must be a non-empty string without "/"`)
    }
    if (!isRecord(note.fields)) {
      throw new BadRequest(`notes[${index}].fields must be an object`)
    }
    const fields: Record<string, string> = {}
    for (const [name, value] of Object.entries(note.fields)) {
      if (!isName(name) || typeof value !== 'string') {
        throw new BadRequest(
          `notes[${index}].fields: names must be non-empty without "/" and values strings`,
        )
      }
      fields[name] = value
    }
    return { id: note.id, fields }
  })
}

export function createApp(store: Store): Hono {
  const app = new Hono()

  app.use(cors())

  app.onError((error, c) => {
    if (error instanceof BadRequest) return c.json({ error: error.message }, 400)
    console.error(error)
    return c.json({ error: 'internal error' }, 500)
  })

  app.get('/health', (c) => c.json({ ok: true }))

  app.put('/notes', bodyLimit({ maxSize: MAX_BODY_BYTES }), async (c) => {
    let payload: unknown
    try {
      payload = await c.req.json()
    } catch {
      throw new BadRequest('body must be valid JSON')
    }
    const notes = parseNotes(payload)
    store.upsertNotes(notes)
    return c.json({ upserted: notes.length })
  })

  app.get('/notes', (c) => {
    const fields = (c.req.query('fields') ?? '').split(',').filter((name) => name.length > 0)
    if (fields.length === 0) {
      throw new BadRequest('fields is required, e.g. ?fields=title,synced')
    }
    return c.json(store.listNotes(fields).map((note) => ({ ...note.fields, id: note.id })))
  })

  app.get('/notes/:id', (c) => {
    const fields = store.getNote(c.req.param('id'))
    return fields ? c.json({ fields }) : c.json({ error: 'not found' }, 404)
  })

  app.delete('/notes/:id', (c) => {
    store.deleteNote(c.req.param('id'))
    return c.body(null, 204)
  })

  return app
}
