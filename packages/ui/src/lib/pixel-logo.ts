import type * as React from 'react'

export type PixelLogoProps = Omit<React.ComponentProps<'svg'>, 'children'> & {
  /** edge length of one pixel cell in px. */
  cell?: number
}

/** accent for the cursor bar and the dot; everything else uses the given base color. */
export function pixelFill(char: string, base: string) {
  return char === '|' || char === '.' ? 'var(--primary)' : base
}
