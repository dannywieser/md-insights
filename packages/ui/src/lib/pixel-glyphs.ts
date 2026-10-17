/** rows of a glyph; '#' is a filled cell. */
type Glyph = readonly string[]

/** every glyph is 9 rows: ascenders in rows 0-1, x-height in rows 2-6, descenders in rows 7-8. */
export const GLYPH_ROWS = 9

function glyph(rows: Record<number, string>, width: number): Glyph {
  return Array.from({ length: GLYPH_ROWS }, (_, y) => rows[y] ?? '.'.repeat(width))
}

export const GLYPHS: Record<string, Glyph> = {
  '.': glyph({ 5: '##', 6: '##' }, 2),
  m: glyph({ 2: '#####', 3: '#.#.#', 4: '#.#.#', 5: '#.#.#', 6: '#.#.#' }, 5),
  d: glyph(
    { 0: '....#', 1: '....#', 2: '.####', 3: '#...#', 4: '#...#', 5: '#...#', 6: '.####' },
    5,
  ),
  i: glyph({ 0: '.#.', 2: '##.', 3: '.#.', 4: '.#.', 5: '.#.', 6: '###' }, 3),
  v: glyph({ 2: '#...#', 3: '#...#', 4: '#...#', 5: '.#.#.', 6: '..#..' }, 5),
  z: glyph({ 2: '#####', 3: '....#', 4: '...#.', 5: '.#...', 6: '#####' }, 5),
  '-': glyph({ 4: '####' }, 4),
}

export type PixelRect = { x: number; y: number; char: string }

export type PixelLayout = { rects: PixelRect[]; width: number; height: number }

/** lays text out as filled cells, one empty cell between glyphs, trimmed to the rows it uses. */
export function layoutPixels(text: string): PixelLayout {
  const rects: PixelRect[] = []
  let x = 0
  for (const [index, char] of [...text].entries()) {
    const rows = GLYPHS[char]
    if (!rows) throw new Error(`no pixel glyph for "${char}"`)
    if (index > 0) x += 1
    rows.forEach((row, y) => {
      for (let dx = 0; dx < row.length; dx++) {
        if (row[dx] === '#') rects.push({ x: x + dx, y, char })
      }
    })
    x += rows[0].length
  }
  const top = Math.min(...rects.map((r) => r.y))
  const bottom = Math.max(...rects.map((r) => r.y))
  return {
    rects: rects.map((r) => ({ ...r, y: r.y - top })),
    width: x,
    height: bottom - top + 1,
  }
}
