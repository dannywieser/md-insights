import { fireEvent, render, screen } from '@testing-library/react'
import { NoteGrid, type Note } from '../src'

function makeNotes(count: number): Note[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `n${i}`,
    title: `note ${i}`,
    color: i % 10,
  }))
}

describe('NoteGrid', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('draws one square per note', () => {
    const { container } = render(<NoteGrid notes={makeNotes(12)} />)

    expect(container.querySelectorAll('.note-square')).toHaveLength(12)
  })

  it('has no per-note title elements', () => {
    const { container } = render(<NoteGrid notes={makeNotes(3)} />)

    expect(container.querySelectorAll('title')).toHaveLength(0)
  })

  describe('hover', () => {
    function hover(container: HTMLElement, index: number) {
      const svg = container.querySelector('svg')!
      const rect = container.querySelectorAll('.note-square')[index]
      const x = Number(rect.getAttribute('x')) + 2
      const y = Number(rect.getAttribute('y')) + 2
      fireEvent.pointerMove(svg, { clientX: x, clientY: y })
    }

    it('shows one shared tooltip and outline for the hovered note', () => {
      const { container } = render(<NoteGrid notes={makeNotes(6)} />)

      hover(container, 4)

      expect(screen.getByRole('tooltip')).toHaveTextContent('note 4')
      expect(container.querySelectorAll('.note-hover')).toHaveLength(1)
    })

    it('follows the pointer from cell to cell', () => {
      const { container } = render(<NoteGrid notes={makeNotes(6)} />)

      hover(container, 1)
      expect(screen.getByRole('tooltip')).toHaveTextContent('note 1')
      hover(container, 5)
      expect(screen.getByRole('tooltip')).toHaveTextContent('note 5')
    })

    it('shows nothing over a placeholder, outside the grid, or after leaving', () => {
      const { container } = render(<NoteGrid notes={makeNotes(5)} />)
      const svg = container.querySelector('svg')!
      const placeholder = container.querySelector('.note-placeholder')!

      fireEvent.pointerMove(svg, {
        clientX: Number(placeholder.getAttribute('x')) + 2,
        clientY: Number(placeholder.getAttribute('y')) + 2,
      })
      expect(screen.queryByRole('tooltip')).toBeNull()

      fireEvent.pointerMove(svg, { clientX: -5, clientY: -5 })
      expect(screen.queryByRole('tooltip')).toBeNull()

      hover(container, 0)
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      fireEvent.pointerLeave(svg)
      expect(screen.queryByRole('tooltip')).toBeNull()
    })
  })

  it('keeps every note visible as the set grows', () => {
    const { container } = render(<NoteGrid notes={makeNotes(5000)} />)

    expect(container.querySelectorAll('.note-square')).toHaveLength(5000)
  })

  it('draws bigger squares for fewer notes', () => {
    const squareSize = (count: number) => {
      const { container, unmount } = render(<NoteGrid notes={makeNotes(count)} />)
      const size = Number(container.querySelector('.note-square')?.getAttribute('width'))
      unmount()
      return size
    }

    expect(squareSize(5)).toBeGreaterThan(squareSize(100))
  })

  it('sizes the grid to its cells plus the border', () => {
    const { container } = render(<NoteGrid notes={makeNotes(2)} />)
    const svg = container.querySelector('svg')
    const cell = Number(container.querySelector('.note-square')?.getAttribute('width'))

    expect(Number(svg?.getAttribute('width'))).toBe(2 * cell + 3)
    expect(container.querySelectorAll('.note-placeholder')).toHaveLength(0)
  })

  it('is always a rectangle: placeholders fill the short last row', () => {
    const { container } = render(<NoteGrid notes={makeNotes(5)} />)
    const cell = Number(container.querySelector('.note-square')?.getAttribute('width'))
    const svg = container.querySelector('svg')
    const cells = (Number(svg?.getAttribute('width')) - 3) / cell
    const rows = (Number(svg?.getAttribute('height')) - 3) / cell

    expect(cells * rows).toBe(5 + container.querySelectorAll('.note-placeholder').length)
    expect(container.querySelectorAll('.note-placeholder').length).toBeGreaterThan(0)
  })

  it('draws a border around the grid', () => {
    const { container } = render(<NoteGrid notes={makeNotes(5)} />)

    expect(container.querySelector('.note-border')).not.toBeNull()
  })

  it('is the bare grid, not a card', () => {
    const { container } = render(<NoteGrid notes={makeNotes(3)} />)

    expect(container.querySelector('[data-slot="card"]')).toBeNull()
  })

  it('wraps colour indexes onto the palette', () => {
    const notes = [
      { id: 'a', title: 'a', color: 13 },
      { id: 'b', title: 'b', color: -1 },
    ]
    const { container } = render(<NoteGrid notes={notes} />)

    const colors = [...container.querySelectorAll('.note-square')].map((el) =>
      el.getAttribute('data-color'),
    )
    expect(colors).toEqual(['3', '9'])
  })

  it('shows a lowercase empty state', () => {
    const { container } = render(<NoteGrid notes={[]} />)

    expect(screen.getByText('no notes')).toBeInTheDocument()
    const text = container.textContent
    expect(text).toBe(text.toLowerCase())
  })
})
