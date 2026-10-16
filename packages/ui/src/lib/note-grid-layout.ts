export type GridLayoutInput = {
  count: number
  width: number
  height: number
  /** optional upper bound for the cell. */
  maxCell?: number
}

export type GridLayout = {
  columns: number
  rows: number
  /** side of one square cell, in whole px. */
  cell: number
}

function rowsFor(count: number, width: number, cell: number) {
  const columns = Math.max(1, Math.min(Math.floor(width / cell), count))
  return { columns, rows: Math.ceil(count / columns) }
}

/**
 * Picks the largest whole-pixel cell for which `count` equal cells fit in a width x height box.
 * Cells shrink as the count grows so every note stays visible. When even a 1px cell cannot hold
 * the count the grid overflows the height rather than dropping notes.
 */
export function layoutGrid({
  count,
  width,
  height,
  maxCell = Infinity,
}: GridLayoutInput): GridLayout {
  const limit = Math.max(1, Math.min(Math.floor(width), Math.floor(height), maxCell))
  let low = 1
  let high = limit
  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    const { rows } = rowsFor(count, width, mid)
    if (rows * mid <= height) low = mid
    else high = mid - 1
  }
  return { ...rowsFor(count, width, low), cell: low }
}
