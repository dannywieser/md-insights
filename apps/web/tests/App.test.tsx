import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

describe('App', () => {
  it('renders the hello world card', () => {
    render(<App />)

    expect(screen.getByText('md-insights')).toBeInTheDocument()
    expect(screen.getByText('Hello, world!')).toBeInTheDocument()
  })
})
