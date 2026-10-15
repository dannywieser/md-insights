import { Section } from './Section'

const solarized = [
  'base03',
  'base02',
  'base01',
  'base00',
  'base0',
  'base1',
  'base2',
  'base3',
  'yellow',
  'orange',
  'red',
  'magenta',
  'violet',
  'blue',
  'cyan',
  'green',
]

const roles = [
  'background',
  'foreground',
  'card',
  'popover',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'border',
  'input',
  'ring',
]

function Swatch({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <div className="space-y-1.5">
      <div
        className="h-14 rounded-md border"
        style={{ backgroundColor: `var(${cssVar})` }}
        aria-hidden
      />
      <p className="text-xs font-bold">{label}</p>
      <p className="text-xs text-muted-foreground">{cssVar}</p>
    </div>
  )
}

export function Palette() {
  return (
    <Section title="Color" description="Solarized palette and the semantic roles mapped onto it.">
      <h3 className="text-sm font-bold">Solarized</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {solarized.map((name) => (
          <Swatch key={name} label={name} cssVar={`--sol-${name}`} />
        ))}
      </div>
      <h3 className="text-sm font-bold">Roles</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {roles.map((name) => (
          <Swatch key={name} label={name} cssVar={`--${name}`} />
        ))}
      </div>
    </Section>
  )
}
