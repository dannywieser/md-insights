import { z } from '@hono/zod-openapi'

/** IDs and field names are joined as `<id>/<field>`, so they are non-empty and slash-free. */
export const NameSchema = z.string().regex(/^[^/]+$/, 'must be non-empty and must not contain "/"')

export const IdSchema = NameSchema.meta({ description: 'client-chosen note id', example: 'abc123' })

export const FieldsSchema = z
  .record(NameSchema, z.string())
  .meta({ description: 'string fields by name', example: { title: 'plan', body: 'raised beds' } })

export const NoteInputSchema = z.object({ id: IdSchema, fields: FieldsSchema })

export const UpsertBodySchema = z.object({ notes: z.array(NoteInputSchema) })

export const UpsertResultSchema = z.object({ upserted: z.number().int().nonnegative() })

export const ListQuerySchema = z.object({
  fields: z
    .string()
    .min(1)
    .meta({ description: 'comma-separated field names to include', example: 'title,synced' }),
})

/** A list row is the requested fields plus the note id. */
export const NoteRowSchema = z.object({ id: IdSchema }).catchall(z.string())

export const NoteRowsSchema = z.array(NoteRowSchema)

export const NoteSchema = z.object({ fields: FieldsSchema })

export const IdParamSchema = z.object({ id: IdSchema })

export const HealthSchema = z.object({ ok: z.literal(true) })

export const ErrorSchema = z.object({ error: z.string() })
