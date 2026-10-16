import { useMemo, useState } from 'react'
import { Button, NOTE_COLORS, NoteGrid, type Note } from '@md-insights/ui'
import { Section } from './Section'

const presets = [5, 50, 500, 5000]
const MAX_COUNT = 20000

/** deterministic colours so the board looks the same on every load. */
function makeNotes(count: number): Note[] {
  let seed = 7
  return Array.from({ length: count }, (_, i) => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return { id: `note-${i}`, title: `note ${i + 1}`, color: seed % NOTE_COLORS }
  })
}

export function NoteGridDemo() {
  const [count, setCount] = useState(50)
  const notes = useMemo(() => makeNotes(count), [count])

  return (
    <Section
      title="note grid"
      description="a grid of notes, each a square. squares shrink as the set grows so every note stays visible."
    >
      <div className="flex flex-wrap items-center gap-3">
        {presets.map((preset) => (
          <Button
            key={preset}
            size="sm"
            variant={preset === count ? 'default' : 'outline'}
            onClick={() => setCount(preset)}
          >
            {preset}
          </Button>
        ))}
        <label className="flex items-center gap-2 text-sm">
          notes
          <input
            type="range"
            min={1}
            max={MAX_COUNT}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
        </label>
      </div>
      <NoteGrid notes={notes} />
    </Section>
  )
}
