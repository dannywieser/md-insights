import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../src/App'

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    mockMatchMedia(false)
  })

  it('renders every section of the design board', () => {
    render(<App />)

    for (const name of ['Color', 'Typography', 'Spacing', 'Radius', 'Components']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    }
  })

  it('toggles the dark class and remembers the choice', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('md-insights-design-theme')).toBe('dark')

    await userEvent.click(screen.getByRole('button', { name: 'Switch to light' }))

    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('md-insights-design-theme')).toBe('light')
  })

  it('follows the system color scheme when nothing is stored', () => {
    mockMatchMedia(true)
    render(<App />)

    expect(document.documentElement).toHaveClass('dark')
  })
})
