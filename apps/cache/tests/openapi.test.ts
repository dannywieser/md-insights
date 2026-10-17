import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildOpenApiJson } from '../src/openapi.ts'

describe('openapi.json', () => {
  it('matches the routes (run "pnpm --filter @md-viz/cache openapi" to update)', () => {
    const committed = readFileSync(resolve(import.meta.dirname, '../openapi.json'), 'utf8')
    expect(committed).toBe(buildOpenApiJson())
  })
})
