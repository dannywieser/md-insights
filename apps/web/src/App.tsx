import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listNotesOptions } from '@md-insights/api-client/cache'
import { AppHeader, Card, NoteGrid, makeFakeNotes } from '@md-insights/ui'

const FAKE_NOTE_COUNT = 5000
// card padding (p-4) plus its 1px border.
const CARD_INSET = 17

export function App() {
  // placeholder data until notes are loaded for real.
  const notes = useMemo(() => makeFakeNotes(FAKE_NOTE_COUNT), [])

  // temporary proof that the generated query hook reaches the cache; the grid still shows fake notes.
  const { data, error } = useQuery(listNotesOptions({ query: { fields: 'title,synced' } }))
  useEffect(() => {
    if (data) console.log('cache notes', data)
    if (error) console.error('cache request failed', error)
  }, [data, error])

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="md-insights" />
      <main className="min-h-0 flex-1 p-6">
        <NoteGrid
          notes={notes}
          inset={CARD_INSET}
          frame={(grid) => <Card className="gap-0 p-4">{grid}</Card>}
        />
      </main>
    </div>
  )
}
