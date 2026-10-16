import { render, screen } from '@testing-library/react'
import { Wordmark } from '../src'
import { layoutPixels } from '../src/lib/pixel-glyphs'

describe('Wordmark', () => {
  it('draws one rect per lit cell and colors the cursor and dot with the accent', () => {
    render(<Wordmark />)

    const rects = screen.getByRole('img', { name: 'md-insights' }).querySelectorAll('rect')
    expect(rects).toHaveLength(layoutPixels('.md|insights').rects.length)
    const accent = [...rects].filter((r) => r.getAttribute('fill') === 'var(--primary)')
    // dot (2x2) and cursor bar (2x9)
    expect(accent).toHaveLength(4 + 18)
  })

  it('contains no text, only pixels', () => {
    render(<Wordmark />)

    expect(screen.getByRole('img').textContent).toBe('')
  })
})
