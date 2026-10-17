import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Api, ScanProgress, ScanResult } from '../../src/shared/ipc'
import { App } from '../../src/renderer/src/App'

function stubApi(overrides: Partial<Api> = {}) {
  const unsubscribe = vi.fn()
  let pushProgress: (progress: ScanProgress) => void = () => {}
  const api: Api = {
    pickFolder: vi.fn().mockResolvedValue('/notes'),
    scanFolder: vi.fn().mockResolvedValue({ mdCount: 18 }),
    onScanProgress: vi.fn((callback: (progress: ScanProgress) => void) => {
      pushProgress = callback
      return unsubscribe
    }),
    ...overrides,
  }
  window.api = api
  return { api, unsubscribe, push: (p: ScanProgress) => pushProgress(p) }
}

describe('App', () => {
  it('renders the app header and a choose-folder button', () => {
    stubApi()
    render(<App />)

    expect(screen.getByRole('banner')).toHaveTextContent('md-viz')
    expect(screen.getByRole('button', { name: 'choose folder' })).toBeEnabled()
  })

  it('picks a folder, scans it and shows the note count', async () => {
    const { api, unsubscribe } = stubApi()
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'choose folder' }))

    expect(await screen.findByText('18 notes')).toBeInTheDocument()
    expect(screen.getByLabelText('chosen folder')).toHaveTextContent('/notes')
    expect(api.scanFolder).toHaveBeenCalledWith('/notes')
    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('shows progress while the scan is running', async () => {
    let finish: (value: ScanResult) => void = () => {}
    const { push } = stubApi({
      scanFolder: vi.fn(() => new Promise<ScanResult>((resolve) => (finish = resolve))),
    })
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'choose folder' }))
    push({ dirs: 3, mdFiles: 7 })

    expect(await screen.findByText(/3 folders, 7 notes so far/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'choose folder' })).toBeDisabled()

    finish({ mdCount: 7 })
    expect(await screen.findByText('7 notes')).toBeInTheDocument()
    expect(screen.queryByText(/so far/)).not.toBeInTheDocument()
  })

  it('does nothing when the dialog is cancelled', async () => {
    const { api } = stubApi({ pickFolder: vi.fn().mockResolvedValue(null) })
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'choose folder' }))

    expect(api.scanFolder).not.toHaveBeenCalled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows an error when the scan fails', async () => {
    stubApi({ scanFolder: vi.fn().mockRejectedValue(new Error('Not a directory')) })
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'choose folder' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('not a directory')
    expect(screen.getByRole('button', { name: 'choose folder' })).toBeEnabled()
  })
})
