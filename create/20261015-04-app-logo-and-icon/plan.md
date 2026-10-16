# plan: app logo and icon

## Goal

Give md-insights a pixel-art identity: a `.md` icon mark (favicon now, Electron/README later) and a `.md|insights` wordmark for app headers. Both are built from hand-made bitmap glyphs, drawn in theme colors, in the existing design language (square, lowercase, Solarized, Space Mono feel). The design board gets a new section, and both apps get the new header wordmark and favicon.

## Scope

In:
- Bitmap glyph data (about 5x7 cells) for `.`, `m`, `d`, `|`, `i`, `n`, `s`, `g`, `h`, `t` - only the letters the logo needs
- `Logo` (icon mark) and `Wordmark` React components in `packages/ui`, rendered as SVG `<rect>`s using theme tokens so light/dark follow automatically
- `|` drawn as a cursor bar in an accent color (`--primary`, Solarized orange); other pixels in `--foreground`
- `AppHeader` shows the wordmark (accessible name kept as the title)
- Static SVG favicons for `apps/web` and `apps/design`
- New design-board section "logo" and a guideline entry
- Tests

Out (for now):
- PNG / ICO / icns exports (wait for the Electron app)
- README banner
- A full pixel font or arbitrary pixel-text component

## Technologies

- React + SVG (`shape-rendering="crispEdges"`), no image dependencies: scales cleanly and picks up CSS variables
- A single shared glyph/pixel-map module so the component and the favicon cannot drift; favicon is a static file because `<link rel="icon">` cannot read CSS variables (uses fixed Solarized hex with `prefers-color-scheme` media query inside the SVG)
- Vitest + Testing Library (existing)

## Repository structure

```
packages/ui/src/
  components/
    logo.tsx            (new) Logo + Wordmark components
    app-header.tsx      (modified) renders wordmark
  lib/
    pixel-glyphs.ts     (new) bitmap data + layout helper (glyph rows -> rect list)
  index.ts              (modified) export Logo, Wordmark
packages/ui/tests/
  pixel-glyphs.test.ts  (new)
  logo.test.tsx         (new)
  app-header.test.tsx   (modified)
apps/web/
  index.html            (modified) favicon link
  public/favicon.svg    (new)
apps/design/
  index.html            (modified) favicon link
  public/favicon.svg    (new)
  src/App.tsx           (modified) add Logo section
  src/sections/Logo.tsx (new) design-board section
  src/sections/Guidelines.tsx (modified) logo guideline
  tests/App.test.tsx    (modified) "logo" section heading
```

## Files

- `packages/ui/src/lib/pixel-glyphs.ts` - 5x7 bitmaps for the needed characters, plus `layout(text)` returning pixel rects and total width/height with 1-cell letter spacing
- `packages/ui/src/components/logo.tsx` - `Logo` (`.md` mark on a square tile) and `Wordmark` (`.md|insights`); props for pixel size; `role="img"` with lowercase `aria-label`
- `packages/ui/src/components/app-header.tsx` - replace the text `<h1>` content with `Wordmark`, keeping the `title` as the accessible name (design viewer appends " design" as plain text beside it)
- `packages/ui/src/index.ts` - exports
- `apps/*/public/favicon.svg`, `apps/*/index.html` - favicon (icon mark, light/dark via media query); design viewer may use the same file
- `apps/design/src/sections/Logo.tsx` - shows icon at several sizes, wordmark, light/dark on card and grid paper, and the pixel grid/construction
- `apps/design/src/sections/Guidelines.tsx` - new guideline: the logo is pixel art on a 5x7 grid, `|` is the accent-colored cursor, no smoothing or rounding
- Tests as listed above

## Steps

1. Define the glyph bitmaps and `layout` helper in `pixel-glyphs.ts`, with tests (every glyph is 5x7, layout dimensions, unknown characters rejected)
2. Build `Logo` and `Wordmark` components using the layout and theme tokens; export them; test roles, labels and that rect count matches the bitmap
3. Update `AppHeader` to render the wordmark and adjust its tests; check both apps' existing tests still pass (the web test expects banner text `md-insights`)
4. Create the favicon SVGs and link them in both `index.html` files
5. Add the design-board "logo" section and the guideline entry; update the design App test (section list, lowercase check)
6. Run `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, then view both apps in light and dark and check the favicon and the header

## Open questions / risks

- Text for assistive tech and the web test: an SVG wordmark has no text content, so the header needs a visually hidden/aria-label text for `toHaveTextContent('md-insights')`; the test may need to read the accessible name instead. Decide in step 3.
- Favicon colors are fixed hex because CSS variables don't reach it; they must be kept in sync with the theme by hand (noted in the guideline).
- Legibility of `.md|insights` at small header height: about 11 characters x 6 cells = roughly 66 cells wide, so a 2px cell gives a 132px-wide mark. Confirm the size when viewing.
- The Space Mono page title `md-insights` stays the browser tab title.
