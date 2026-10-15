import { render, screen } from '@testing-library/react'
import { AppHeader } from '../src'

describe('AppHeader', () => {
  it('renders the title as a heading inside a banner', () => {
    render(<AppHeader title="notes" />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'notes' })).toBeInTheDocument()
  })

  it('renders actions beside the title', () => {
    render(
      <AppHeader title="notes">
        <button>sync</button>
      </AppHeader>,
    )

    expect(screen.getByRole('button', { name: 'sync' })).toBeInTheDocument()
  })
})
