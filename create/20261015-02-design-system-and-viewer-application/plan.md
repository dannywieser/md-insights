# Plan: design system and viewer application

## Goal

Introduce a Solarized light/dark theme with Space Mono as the shared design system in `packages/ui`, and add a second, standalone web app `apps/design` that acts as a "design-board" viewer for the theme tokens and existing components. The viewer exists to make exploring and iterating on the theme fast; `apps/web` inherits the theme for free.

## Scope

In:

- Solarized light and dark color tokens mapped onto the existing shadcn semantic roles (`--background`, `--primary`, ...), replacing the neutral defaults in `packages/ui/src/styles/globals.css`
- Space Mono, self-hosted via `@fontsource/space-mono`, set as the sans/mono font family for the theme
- New `apps/design` Vite + React app on port 5174, own `dev` script, root `pnpm dev:design`
- Single design-board page: color palette (Solarized base + accents and the semantic roles), type scale, spacing scale, radius scale, and the existing Button (variants/sizes) and Card
- Light/dark toggle in the viewer (class `dark` on `<html>`, remembered in localStorage, default follows `prefers-color-scheme`)
- Tests for the viewer, CLAUDE.md/README updates

Out:

- New components (added later as exploration calls for them)
- Side-by-side light/dark view, live token editing, multiple pages/routing
- Storybook
- Any change to `apps/web` beyond inheriting the theme

## Technologies

- React 19, Vite, Tailwind v4, Vitest + Testing Library: identical to `apps/web` for consistency
- `@fontsource/space-mono`: self-hosted font, works offline on the homelab
- Tokens as CSS custom properties (oklch or hex Solarized values) wired through Tailwind's `@theme inline`; no JS theme layer

## Repository structure

```
apps/design/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  src/
    main.tsx
    index.css
    App.tsx
    theme.ts                  (theme toggle hook)
    sections/
      Palette.tsx
      Typography.tsx
      Spacing.tsx
      Radius.tsx
      Components.tsx
  tests/
    setup.ts
    App.test.tsx
packages/ui/
  package.json                (add @fontsource/space-mono)
  src/styles/globals.css      (Solarized tokens, font)
```

## Files

Create:

- `apps/design/package.json`: `@md-insights/design`, scripts `dev`, `build`, `preview`, `typecheck`, `test`; deps mirror `apps/web`
- `apps/design/vite.config.ts`: react + tailwind plugins, `server.port: 5174` with `strictPort`, vitest config
- `apps/design/tsconfig.json`, `index.html`, `tests/setup.ts`: same shape as `apps/web`
- `apps/design/src/index.css`: imports `@md-insights/ui/globals.css` and `@source` for `packages/ui/src`
- `apps/design/src/main.tsx`, `App.tsx`: entry, layout, header with theme toggle
- `apps/design/src/theme.ts`: toggle hook (class on `<html>`, localStorage, prefers-color-scheme)
- `apps/design/src/sections/*.tsx`: the board sections
- `apps/design/tests/App.test.tsx`: sections render, toggle flips the `dark` class

Modify:

- `packages/ui/src/styles/globals.css`: Solarized light/dark values, font import and `--font-sans`/`--font-mono`, any extra tokens (Solarized accent colors exposed as `--color-*` so the palette section can show them)
- `packages/ui/package.json`: add `@fontsource/space-mono`
- `package.json` (root): add `dev:design` script
- `CLAUDE.md`, `README.md`: document `apps/design`, `pnpm dev:design`, port, and that theme tokens live in `packages/ui`
- `pnpm-lock.yaml`: updated by install

## Steps

1. Scaffold `apps/design` (package.json, configs, index.html, entry, stub App), add root `dev:design`, `pnpm install`, confirm it starts on 5174
2. Add `@fontsource/space-mono` to `packages/ui` and apply Space Mono in `globals.css`
3. Replace neutral tokens with Solarized light/dark mapped to the semantic roles; expose the raw Solarized palette as tokens
4. Theme toggle hook plus header toggle in the viewer
5. Palette section (raw Solarized swatches and semantic roles, light/dark aware)
6. Typography section (type scale with Space Mono weights) and spacing and radius sections
7. Components section (Button variants/sizes, Card)
8. Tests for `apps/design`; check `apps/web` test still passes with the new theme
9. Update CLAUDE.md and README; run `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`; visually check both themes in the browser

## Open questions / risks

- Mapping Solarized to shadcn roles is a judgment call (e.g. `primary` = blue vs. base content color, `destructive` = red); first pass will be adjusted by eye in the viewer, which is the point of the session
- Space Mono is monospace-only, so UI density and widths will change noticeably; revisit after seeing it
- Solarized's low-contrast design can fail WCAG for `muted-foreground`; check contrast when mapping
- Tailwind v4 `@source` and fontsource CSS import resolving through the workspace package: verify in step 1/2
