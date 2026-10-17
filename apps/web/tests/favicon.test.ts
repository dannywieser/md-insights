import { readFileSync } from 'node:fs'
import { layoutPixels } from '@md-viz/ui/lib/pixel-glyphs'

const favicons = ['../public/favicon.svg', '../../design/public/favicon.svg']

describe('favicon', () => {
  it.each(favicons)('%s matches the logo pixels', (path) => {
    const svg = readFileSync(new URL(path, import.meta.url), 'utf8')
    const { rects, width, height } = layoutPixels('.md')
    const dx = Math.floor((16 - width) / 2)
    const dy = Math.floor((16 - height) / 2)

    const drawn = [...svg.matchAll(/<rect x="(\d+)" y="(\d+)"/g)].map((m) => `${m[1]},${m[2]}`)
    const expected = rects.map((r) => `${r.x + dx},${r.y + dy}`)

    expect(drawn).toEqual(expected)
  })
})
