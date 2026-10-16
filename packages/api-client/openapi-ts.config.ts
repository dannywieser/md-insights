import { defineConfig } from '@hey-api/openapi-ts'

/** One entry per API; each spec lives beside the server it describes. */
const apis = [{ name: 'cache', spec: '../../apps/cache/openapi.json' }]

export default defineConfig(
  apis.map(({ name, spec }) => ({
    input: spec,
    output: `src/generated/${name}`,
    plugins: [
      '@hey-api/typescript',
      'zod',
      { name: '@hey-api/sdk', validator: true },
      '@hey-api/client-fetch',
      '@tanstack/react-query',
    ],
  })),
)
