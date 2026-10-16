import { render as rtlRender, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { configureCacheClient } from '@md-insights/api-client/cache'
import { App } from '../src/App'

function render(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return rtlRender(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('App', () => {
  beforeEach(() => {
    configureCacheClient({ baseUrl: 'http://cache.test' })
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(600)
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response('[{"id":"a","fields":{"title":"plan"}}]', {
            headers: { 'content-type': 'application/json' },
          }),
        ),
      ),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
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

  it('requests the note list from the cache through the generated query', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    render(<App />)

    await waitFor(() =>
      expect(log).toHaveBeenCalledWith('cache notes', [{ id: 'a', fields: { title: 'plan' } }]),
    )
    const request = vi.mocked(fetch).mock.calls[0][0] as Request
    expect(request.url).toContain('/notes?fields=title%2Csynced')
  })
})
