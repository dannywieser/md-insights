# Summary: app logo and icon

- **Slug:** 20261015-04-app-logo-and-icon
- **Started / completed:** 2026-10-15 / 2026-10-15

## Overview

md-insights got a pixel-art identity: a `.md` icon mark and a `.md|insights` wordmark, drawn from hand-made bitmap glyphs in the theme colors and the existing design language. The wordmark is now the header of both apps, both apps have a favicon, and the design board has a logo section and guideline.

## What was done

- `packages/ui`: `lib/pixel-glyphs.ts` (glyph bitmaps, `layoutPixels`), `lib/pixel-logo.ts` (shared props and accent rule), `components/logo.tsx` (`Logo`), `components/wordmark.tsx` (`Wordmark`), exports in `index.ts`
- `AppHeader` renders the wordmark, with a `subtitle` prop; the title stays as screen-reader text
- `apps/web` and `apps/design`: `public/favicon.svg` and a favicon link in each `index.html`
- `apps/design`: new `sections/Logo.tsx` (wordmark on card, grid paper and dark card; icon at four sizes; glyph sheet), a "pixel logo" guideline, section added to `App.tsx`
- Tests: `pixel-glyphs`, `logo`, `wordmark`, `app-header` in `packages/ui`; `favicon.test.ts` in `apps/web`; design App test lists the logo section

## Highlights

- Glyphs are SVG rects with `shape-rendering="crispEdges"` using CSS variables, so light/dark follow the theme; the dot and `|` cursor bar use `--primary`
- Two empty cells around `|` (one between other glyphs) after review
- The favicon cannot read CSS variables, so it is a static copy; a test compares its pixels with the glyph data
- `Logo` and `Wordmark` were split into separate files on request

## Deviations from the plan

- Glyphs are 5x9, not 5x7 (ascenders and the `g` descender); layout trims to used rows
- `AppHeader` gained a `subtitle` prop
- The favicon is a self-contained tile with fixed hex colors, no media query
- The favicon drift test lives in `apps/web` (ui has no node types)

## Not done / follow-ups

- PNG, ICO and icns exports for the Electron app
- README banner
- The web app header was not checked in a browser (covered by tests only)

## Harvest

- `CLAUDE.md`: added a convention line on the pixel logo, `AppHeader` showing the wordmark, and keeping the static favicons in sync by hand (with the test that catches pixel drift)
- `README.md`: nothing needed updating
