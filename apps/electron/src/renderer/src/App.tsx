import { useState } from 'react'
import { AppHeader, Button, Card, CardContent, CardHeader, CardTitle } from '@md-viz/ui'
import type { ScanProgress } from '../../shared/ipc'

export function App() {
  const [folder, setFolder] = useState<string | null>(null)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chooseFolder = async () => {
    const picked = await window.api.pickFolder()
    if (!picked) return

    setFolder(picked)
    setCount(null)
    setProgress(null)
    setError(null)
    setScanning(true)
    const unsubscribe = window.api.onScanProgress(setProgress)
    try {
      const result = await window.api.scanFolder(picked)
      setCount(result.mdCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      unsubscribe()
      setScanning(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="md-viz" />
      <main className="flex-1 overflow-auto p-6">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>hello, notes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Button onClick={() => void chooseFolder()} disabled={scanning}>
                choose folder
              </Button>
            </div>
            {folder && (
              <p className="break-all text-sm" aria-label="chosen folder">
                {folder}
              </p>
            )}
            {scanning && progress && (
              <p role="status" className="text-sm">
                scanning… {progress.dirs} folders, {progress.mdFiles} notes so far
              </p>
            )}
            {count !== null && (
              <p role="status" className="text-2xl font-bold">
                {count} {count === 1 ? 'note' : 'notes'}
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error.toLowerCase()}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
