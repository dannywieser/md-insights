import { Section } from './Section'

const guidelines = [
  {
    name: 'lowercase text only',
    rule: 'all interface text is lowercase: headings, labels, buttons, descriptions and sample content. no title case, no sentence case, no all caps.',
    example: 'save note · open folder · 12 notes',
  },
  {
    name: 'square edges',
    rule: 'no rounded corners on any component. every radius token resolves to zero, so new components inherit square edges automatically.',
    example: 'buttons, cards, inputs, badges: all square',
  },
  {
    name: 'cards',
    rule: 'cards are pure white in light mode and base02 in dark mode, with a hard 4px black shadow in both and right angle crop marks at the corners.',
    example: 'white card · 4px black shadow · crop marks',
  },
  {
    name: 'grid paper',
    rule: 'the page background is grid paper: a 16px cell with a stronger line every 5th cell. layouts and spacing snap to the grid where they can.',
    example: '16px cell · major every 5th · set by --grid-size',
  },
  {
    name: 'pixel logo',
    rule: 'the logo is pixel art from 5 wide bitmap glyphs: no smoothing, no rounding. the dot of the mark and the viz of the wordmark use the primary color, the rest the text color; the wordmark draws each cell as a 2x2 block of small squares. the favicon is a static copy with fixed solarized colors, so update it by hand with the theme.',
    example: '.md · md-viz',
  },
]

export function Guidelines() {
  return (
    <Section
      title="guidelines"
      description="design intentions for the theme. each guideline is also enforced by a test where it can be."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {guidelines.map(({ name, rule, example }) => (
          <div key={name} className="space-y-2 border bg-muted p-4">
            <h3 className="text-sm font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{rule}</p>
            <p className="bg-card px-3 py-2 text-sm">{example}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
