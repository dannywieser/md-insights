import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@md-insights/ui'

export function App() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>md-insights</CardTitle>
          <CardDescription>Analyze the content, links and structure of your notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">Hello, world!</p>
        </CardContent>
      </Card>
    </main>
  )
}
