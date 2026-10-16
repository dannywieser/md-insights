import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(600)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the app header', () => {
    render(<App />)

    expect(screen.getByRole('banner')).toHaveTextContent('md-insights')
  })

  it('shows a card hugging a grid of 5000 notes', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('img', { name: '5000 notes' })).toBeInTheDocument()
    expect(container.querySelectorAll('.note-square')).toHaveLength(5000)
    expect(container.querySelector('[data-slot="note-grid"] [data-slot="card"] svg')).not.toBeNull()
  })
})
