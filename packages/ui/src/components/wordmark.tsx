import { cn } from 'cn'
import { layoutPixels } from '../lib/pixel-glyphs'
import { pixelFill, type PixelLogoProps } from '../lib/pixel-logo'

const WORDMARK = '.md|insights'

/** the app title: a pixel art ".md|insights" with an accent colored cursor bar. */
function Wordmark({ cell = 3, className, ...props }: PixelLogoProps) {
  const { rects, width, height } = layoutPixels(WORDMARK)
  return (
    <svg
      data-slot="wordmark"
      role="img"
      aria-label="md-insights"
      viewBox={`0 0 ${width} ${height}`}
      width={width * cell}
      height={height * cell}
      shapeRendering="crispEdges"
      className={cn('shrink-0 text-foreground', className)}
      {...props}
    >
      {rects.map(({ x, y, char }) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1}
          height={1}
          fill={pixelFill(char, 'currentColor')}
        />
      ))}
    </svg>
  )
}

export { Wordmark }
