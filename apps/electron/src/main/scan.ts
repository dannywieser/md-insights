import { readdir } from 'node:fs/promises'
import path from 'node:path'
import type { ScanProgress, ScanResult } from '../shared/ipc'

export interface ScanOptions {
  /** minimum time between progress callbacks; the final state is always reported. */
  progressIntervalMs?: number
}

const SKIPPED_DIRS = new Set(['node_modules'])

function isSkippedDir(name: string): boolean {
  return name.startsWith('.') || SKIPPED_DIRS.has(name)
}

/**
 * counts `.md` files under `root`, recursively. dot-directories and
 * `node_modules` are skipped; symlinks are not followed; unreadable
 * directories are ignored.
 */
export async function scanMarkdown(
  root: string,
  onProgress?: (progress: ScanProgress) => void,
  { progressIntervalMs = 50 }: ScanOptions = {},
): Promise<ScanResult> {
  const progress: ScanProgress = { dirs: 0, mdFiles: 0 }
  let lastReport = Number.NEGATIVE_INFINITY

  const report = (force = false) => {
    if (!onProgress) return
    const now = performance.now()
    if (!force && now - lastReport < progressIntervalMs) return
    lastReport = now
    onProgress({ ...progress })
  }

  const walk = async (dir: string): Promise<void> => {
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    progress.dirs += 1
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!isSkippedDir(entry.name)) await walk(path.join(dir, entry.name))
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        progress.mdFiles += 1
      }
    }
    report()
  }

  await walk(root)
  report(true)
  return { mdCount: progress.mdFiles }
}
