// the single source of truth for the ipc contract: main registers handlers for
// these channels, preload forwards them and the renderer sees only `Api`.

export const IPC = {
  pickFolder: 'folder:pick',
  scanFolder: 'folder:scan',
  scanProgress: 'folder:scan-progress',
} as const

export interface ScanProgress {
  /** directories visited so far. */
  dirs: number
  /** markdown files found so far. */
  mdFiles: number
}

export interface ScanResult {
  mdCount: number
}

/** what the preload script exposes to the renderer as `window.api`. */
export interface Api {
  /** opens the native folder dialog; resolves to null when cancelled. */
  pickFolder(): Promise<string | null>
  /** counts markdown files under `path`, recursively. */
  scanFolder(path: string): Promise<ScanResult>
  /** subscribes to progress pushed by main during a scan; returns an unsubscribe function. */
  onScanProgress(callback: (progress: ScanProgress) => void): () => void
}
