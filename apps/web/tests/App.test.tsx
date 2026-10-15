import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

describe('App', () => {
  it('renders the app header and the hello world card', () => {
    render(<App />)

    expect(screen.getByRole('banner')).toHaveTextContent('md-insights')
    expect(screen.getByText('hello, world!')).toBeInTheDocument()
  })
})
