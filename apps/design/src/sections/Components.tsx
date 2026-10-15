import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@md-insights/ui'
import { Section } from './Section'

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const sizes = ['xs', 'sm', 'default', 'lg'] as const

export function Components() {
  return (
    <Section title="Components" description="Shared components from @md-insights/ui.">
      <h3 className="text-sm font-bold">Button variants</h3>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <h3 className="text-sm font-bold">Button sizes</h3>
      <div className="flex flex-wrap items-center gap-3">
        {sizes.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
        <Button disabled>disabled</Button>
      </div>
      <h3 className="text-sm font-bold">Card</h3>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description text.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content sits here.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
    </Section>
  )
}
