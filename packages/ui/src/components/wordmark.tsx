import { cn } from 'cn'
import { layoutPixels } from '../lib/pixel-glyphs'
import { pixelFill, type PixelLogoProps } from '../lib/pixel-logo'

const WORDMARK = 'md-viz'
const ACCENT = 'viz'
/** each cell is a 2x2 block of squares: the square edge and the gap between and around them, in cell units. */
const SQUARE = 0.42
const GAP = 0.04
const SUBCELLS = [0, 1].flatMap((sx) => [0, 1].map((sy) => ({ sx, sy })))

/** the app title: a pixel art "md-viz" whose cells are 2x2 blocks of small squares, with "viz" in the accent color. */
function Wordmark({ cell = 3, className, ...props }: PixelLogoProps) {
  const { rects, width, height } = layoutPixels(WORDMARK)
  return (
    <svg
      data-slot="wordmark"
      role="img"
      aria-label="md-viz"
      viewBox={`0 0 ${width} ${height}`}
      width={width * cell}
      height={height * cell}
      shapeRendering="crispEdges"
      className={cn('shrink-0 text-foreground', className)}
      {...props}
    >
      {rects.flatMap(({ x, y, char }) =>
        SUBCELLS.map(({ sx, sy }) => (
          <rect
            key={`${x}-${y}-${sx}-${sy}`}
            x={x + sx * 0.5 + GAP}
            y={y + sy * 0.5 + GAP}
            width={SQUARE}
            height={SQUARE}
            fill={pixelFill(char, 'currentColor', ACCENT)}
          />
        )),
      )}
    </svg>
  )
}

export { Wordmark }
