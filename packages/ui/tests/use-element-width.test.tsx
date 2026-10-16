import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { useElementWidth } from '../src/lib/use-element-width'

function Probe() {
  const ref = useRef<HTMLDivElement>(null)
  const width = useElementWidth(ref)
  return (
    <div ref={ref}>
      <span data-testid="width">{width}</span>
    </div>
  )
}

describe('useElementWidth', () => {
  let width = 200
  let notify: () => void = () => {}

  beforeEach(() => {
    width = 200
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width)
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          notify = callback
        }
        observe() {}
        disconnect() {}
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('reports the width on mount', () => {
    render(<Probe />)

    expect(screen.getByTestId('width')).toHaveTextContent('200')
  })

  it('updates when the element resizes', () => {
    render(<Probe />)
    width = 350
    act(() => notify())

    expect(screen.getByTestId('width')).toHaveTextContent('350')
  })
})
