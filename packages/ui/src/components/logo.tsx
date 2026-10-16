import { cn } from 'cn'
import { layoutPixels } from '../lib/pixel-glyphs'
import { pixelFill, type PixelLogoProps } from '../lib/pixel-logo'

const MARK = '.md'
const TILE = 16

/** the app icon: a pixel art ".md" on a square tile. */
function Logo({ cell = 4, className, ...props }: PixelLogoProps) {
  const { rects, width, height } = layoutPixels(MARK)
  const dx = Math.floor((TILE - width) / 2)
  const dy = Math.floor((TILE - height) / 2)
  return (
    <svg
      data-slot="logo"
      role="img"
      aria-label="md-insights"
      viewBox={`0 0 ${TILE} ${TILE}`}
      width={TILE * cell}
      height={TILE * cell}
      shapeRendering="crispEdges"
      className={cn('shrink-0', className)}
      {...props}
    >
      <rect width={TILE} height={TILE} fill="var(--foreground)" />
      {rects.map(({ x, y, char }) => (
        <rect
          key={`${x}-${y}`}
          x={x + dx}
          y={y + dy}
          width={1}
          height={1}
          fill={pixelFill(char, 'var(--background)')}
        />
      ))}
    </svg>
  )
}

export { Logo }
