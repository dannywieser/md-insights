import {
  AppHeader,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@md-insights/ui'

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader title="md-insights" />
      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>md-insights</CardTitle>
            <CardDescription>
              analyze the content, links and structure of your notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">hello, world!</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
