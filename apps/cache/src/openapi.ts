import { createApp } from './app.ts'
import { createStore } from './store.ts'

/** The OpenAPI 3.1 document for the routes in `app.ts`, serialized as committed in `openapi.json`. */
export function buildOpenApiJson(): string {
  const store = createStore(':memory:')
  try {
    const document = createApp(store).getOpenAPI31Document({
      openapi: '3.1.0',
      info: { title: 'md-viz note cache', version: '0.0.0' },
    })
    return `${JSON.stringify(document, null, 2)}\n`
  } finally {
    store.close()
  }
}
