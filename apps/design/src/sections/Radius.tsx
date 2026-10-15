import { Section } from './Section'

const radii = [
  ['none', 'rounded-none'],
  ['sm', 'rounded-sm'],
  ['md', 'rounded-md'],
  ['lg', 'rounded-lg'],
  ['xl', 'rounded-xl'],
  ['full', 'rounded-full'],
] as const

export function Radius() {
  return (
    <Section title="Radius" description="Derived from --radius in the UI package.">
      <div className="flex flex-wrap gap-6">
        {radii.map(([label, className]) => (
          <div key={label} className="space-y-2 text-center">
            <div className={`size-16 border-2 border-primary bg-secondary ${className}`} />
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
