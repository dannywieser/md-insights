import type * as React from 'react'

export type PixelLogoProps = Omit<React.ComponentProps<'svg'>, 'children'> & {
  /** edge length of one pixel cell in px. */
  cell?: number
}

/** the characters of a glyph text that take the primary color; everything else uses the given base color. */
export function pixelFill(char: string, base: string, accent: string) {
  return accent.includes(char) ? 'var(--primary)' : base
}
