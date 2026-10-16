import { layoutGrid } from '../src/lib/note-grid-layout'

const box = { width: 400, height: 300 }

describe('layoutGrid', () => {
  it('gives fewer notes bigger cells', () => {
    const few = layoutGrid({ count: 5, ...box })
    const many = layoutGrid({ count: 5000, ...box })

    expect(few.cell).toBeGreaterThan(many.cell)
  })

  it.each([1, 5, 50, 500, 5000])('fits all %i notes in the box', (count) => {
    const { columns, rows, cell } = layoutGrid({ count, ...box })

    expect(columns * rows).toBeGreaterThanOrEqual(count)
    expect(columns * cell).toBeLessThanOrEqual(box.width)
    expect(rows * cell).toBeLessThanOrEqual(box.height)
  })

  it('uses whole pixels', () => {
    expect(Number.isInteger(layoutGrid({ count: 137, ...box }).cell)).toBe(true)
  })

  it('makes five notes large cells', () => {
    const { cell, columns, rows } = layoutGrid({ count: 5, ...box })

    expect(cell).toBeGreaterThanOrEqual(100)
    expect(columns * rows).toBeLessThan(5 + columns)
  })

  it('honours an optional cap', () => {
    expect(layoutGrid({ count: 1, ...box }).cell).toBe(300)
    expect(layoutGrid({ count: 1, ...box, maxCell: 32 }).cell).toBe(32)
  })

  it('handles an empty set and a degenerate box', () => {
    expect(layoutGrid({ count: 0, ...box }).rows).toBe(0)
    expect(layoutGrid({ count: 10, width: 0, height: 0 }).cell).toBe(1)
  })

  it('overflows the height instead of dropping notes when 1px cells cannot fit', () => {
    const { columns, rows, cell } = layoutGrid({ count: 1000, width: 10, height: 10 })

    expect(cell).toBe(1)
    expect(columns * rows).toBeGreaterThanOrEqual(1000)
  })
})
