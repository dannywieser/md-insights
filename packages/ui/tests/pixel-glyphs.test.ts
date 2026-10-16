import { GLYPHS, GLYPH_ROWS, layoutPixels } from '../src/lib/pixel-glyphs'

describe('pixel glyphs', () => {
  it('gives every glyph the same number of rows and a consistent width', () => {
    for (const [char, rows] of Object.entries(GLYPHS)) {
      expect(rows, char).toHaveLength(GLYPH_ROWS)
      expect(new Set(rows.map((row) => row.length)).size, char).toBe(1)
    }
  })

  it('covers every character of the logo', () => {
    expect(() => layoutPixels('.md|insights')).not.toThrow()
  })

  it('rejects characters without a glyph', () => {
    expect(() => layoutPixels('x')).toThrow('no pixel glyph for "x"')
  })

  it('separates glyphs by one empty cell', () => {
    // '.' is 2 wide, 'm' is 5 wide
    expect(layoutPixels('.m').width).toBe(2 + 1 + 5)
  })

  it('puts two empty cells around the cursor bar', () => {
    // 'm' 5 + gap 2 + '|' 2 + gap 2 + 'd' 5
    expect(layoutPixels('m|d').width).toBe(5 + 2 + 2 + 2 + 5)
  })

  it('trims the layout to the rows it uses', () => {
    expect(layoutPixels('.md').height).toBe(7)
    expect(layoutPixels('.md|insights').height).toBe(GLYPH_ROWS)
    expect(Math.min(...layoutPixels('.md').rects.map((r) => r.y))).toBe(0)
  })
})
