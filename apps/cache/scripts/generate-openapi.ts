import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildOpenApiJson } from '../src/openapi.ts'

const target = resolve(import.meta.dirname, '../openapi.json')
writeFileSync(target, buildOpenApiJson())
console.log(`wrote ${target}`)
