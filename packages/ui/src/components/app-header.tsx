import * as React from 'react'
import { cn } from 'cn'

function AppHeader({
  title,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'header'>, 'title'> & { title: string }) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-card px-6 py-3 text-card-foreground',
        className,
      )}
      {...props}
    >
      <h1 className="text-lg font-bold">{title}</h1>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  )
}

export { AppHeader }
