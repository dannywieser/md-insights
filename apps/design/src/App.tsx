import { AppHeader, Button } from '@md-insights/ui'
import { Components } from './sections/Components'
import { Grid } from './sections/Grid'
import { Guidelines } from './sections/Guidelines'
import { LogoSection } from './sections/Logo'
import { NoteGridDemo } from './sections/NoteGridDemo'
import { Palette } from './sections/Palette'
import { Spacing } from './sections/Spacing'
import { Typography } from './sections/Typography'
import { useTheme } from './theme'

export function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen">
      <AppHeader title="md-insights design" subtitle="design">
        <Button variant="outline" size="sm" onClick={toggle}>
          {theme === 'dark' ? 'switch to light' : 'switch to dark'}
        </Button>
      </AppHeader>
      <main className="mx-auto max-w-5xl space-y-16 p-8">
        <Guidelines />
        <LogoSection />
        <Palette />
        <Typography />
        <Spacing />
        <Grid />
        <Components />
        <NoteGridDemo />
      </main>
    </div>
  )
}
