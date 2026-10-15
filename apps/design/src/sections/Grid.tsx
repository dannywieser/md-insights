import { Section } from './Section'

const tokens = ['--grid-size', '--grid-line', '--grid-line-major']

export function Grid() {
  return (
    <Section
      title="grid"
      description="grid paper background. minor lines every cell, major lines every 5th cell."
    >
      <div className="flex flex-wrap items-start gap-6">
        <div className="bg-background bg-grid h-[calc(var(--grid-size)*10)] w-[calc(var(--grid-size)*10)] border" />
        <ul className="space-y-1 text-sm">
          {tokens.map((token) => (
            <li key={token}>{token}</li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
