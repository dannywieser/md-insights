import { Button } from '@md-insights/ui'
import { Components } from './sections/Components'
import { Guidelines } from './sections/Guidelines'
import { Palette } from './sections/Palette'
import { Spacing } from './sections/Spacing'
import { Typography } from './sections/Typography'
import { useTheme } from './theme'

export function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-3">
        <h1 className="text-lg font-bold">md-insights design</h1>
        <Button variant="outline" size="sm" onClick={toggle}>
          {theme === 'dark' ? 'switch to light' : 'switch to dark'}
        </Button>
      </header>
      <main className="mx-auto max-w-5xl space-y-12 p-6">
        <Guidelines />
        <Palette />
        <Typography />
        <Spacing />
        <Components />
      </main>
    </div>
  )
}
