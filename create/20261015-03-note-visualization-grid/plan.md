# plan: note visualization grid

> **Revised mid-session:** the isometric cubes were dropped. Notes are now flat squares in a grid with always-on 1px gridlines (pixel-art sprite style). The grid holds only as many cells as notes and the cell size has no cap, so 5 notes give 5 large cells. Cube drawing, the flat/cube threshold and the face shades were removed. Read the text below with that in mind; the layout function, tokens, card and design board section are otherwise as planned. Step 6 (experiments) is now about gridline weight, centred vs edge-to-edge layout and tiny-cell legibility.

## Goal

A shared card component, `NoteGrid`, that shows a set of notes as isometric pixel-art cubes in a grid of equal cells. Cube size is derived from the note count so every note is always shown: 5 notes give large cubes, 5000 give tiny ones. Each note has one of ~10 colours (meaning irrelevant for now). It is built with mock data and shown on the design board, and is meant to be explored by experiment (rendering technique, behaviour at the extremes).

## Scope

In:

- `NoteGrid` card in `packages/ui` (plain props, no note loading)
- a pure layout function that picks columns and cell size for a count and a box
- a cube drawing that is crisp (whole pixels) with three face shades per colour
- ten note colours mapped onto the Solarized tokens, light and dark
- a design board section with mock data and a count control (5 to 5000+) to explore density
- tests for layout, rendering and the section
- a guideline entry on the design board if experiments settle a decision

Out:

- loading real notes (folder or Bear)
- a cap or "+N more": all notes are kept, filtering happens upstream
- per-note size (e.g. linked-note count), grouping into blocks
- interaction beyond a native tooltip (title) per cube; hover/select can come later
- any meaning for colour

## Technologies

- React 19 + TypeScript: already the repo stack.
- Tailwind v4 tokens (`globals.css`) for colours; no new dependencies.
- SVG with `shape-rendering="crispEdges"` as the first renderer: simple, themeable through CSS variables, testable in jsdom. Canvas is the experiment if SVG is too heavy at thousands of cubes (see risks).
- `ResizeObserver` to measure the card's drawing area (mocked in tests).
- Vitest + Testing Library, tests in `tests/` beside `src/`.

## Repository structure

```
packages/ui/
  src/
    components/note-grid.tsx          new
    lib/note-grid-layout.ts           new
    index.ts                          export NoteGrid, layout types
    styles/globals.css                note colour tokens
  tests/
    note-grid.test.tsx                new
    note-grid-layout.test.ts          new
apps/design/
  src/sections/NoteGridDemo.tsx       new
  src/sections/Palette.tsx            (maybe) list note colours
  src/sections/Guidelines.tsx         entry once a decision settles
  src/App.tsx                         add section
  tests/App.test.tsx                  expect new section heading
```

## Files

- `packages/ui/src/lib/note-grid-layout.ts` - pure `layoutGrid(count, width, height?)` returning `{ columns, rows, cell, cube }`; picks the column count that maximises the cell size for the box, snapped to whole pixels; flags when the cell is too small for an isometric cube.
- `packages/ui/src/components/note-grid.tsx` - `NoteGrid` card: header (title, count), measured drawing area, one cube per note, `title` tooltip; uses `Card` styling (hard shadow, crop marks).
- `packages/ui/src/index.ts` - export the component and the `Note` type.
- `packages/ui/src/styles/globals.css` - `--note-0` ... `--note-9` mapped to Solarized accents plus a few derived tones, each with a light and dark variant; face shades computed with `color-mix` (top lighter, left base, right darker).
- `packages/ui/tests/note-grid-layout.test.ts` - layout: 5 notes give larger cells than 5000, every note fits, whole-pixel results, empty set, tiny box.
- `packages/ui/tests/note-grid.test.tsx` - renders one cube per note, titles, empty state, flat-square degrade at small cells, lowercase text.
- `apps/design/src/sections/NoteGridDemo.tsx` - seeded mock notes, count control (5, 50, 500, 5000 and a slider), shown inside a `NoteGrid`.
- `apps/design/src/App.tsx`, `apps/design/tests/App.test.tsx` - add and assert the section.
- `apps/design/src/sections/Guidelines.tsx` - record any decision the experiments settle (e.g. cube style).

## Steps

1. Layout function and its tests (pure, no UI).
2. Note colour tokens (light and dark) in `globals.css`.
3. Cube drawing: one isometric pixel-art cube as SVG polygons with three face shades, crisp on whole pixels; flat square below a minimum cell size.
4. `NoteGrid` card: measure the area with `ResizeObserver`, lay out, render cubes; component tests.
5. Design board section with seeded mock data and the count control; add to `App`, update the App test.
6. Experiment pass with the user in the browser: check 5, 50, 500, 5000 and 20000 notes, light and dark, narrow and wide; tune the minimum cube size, the flat-square threshold, margins and face shades. Try canvas if SVG is sluggish.
7. Record settled decisions as a guideline entry; run `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.

## Open questions / risks

- Performance: 5000 cubes is ~15000 SVG polygons. If rendering or resize is slow, switch the renderer to a single `<canvas>` (same layout function); keeping layout pure makes that swap cheap. Tooltips and a11y then need a different approach.
- Pixel crispness: isometric 2:1 cubes only look clean on certain even sizes; the layout may need to snap cell sizes to a small set of sizes, which wastes some space.
- Readability limit: below roughly 6 to 8 px a cube cannot be told from a square. Where exactly to switch (and whether to switch at all) is an experiment outcome.
- 10 colours on both themes need enough contrast against the card (`base02` in dark) and against each other; may need a few non-Solarized tones.
- Card aspect: width-driven with a fixed or max height? Decide while experimenting; the layout function takes an optional height.
- jsdom has no layout, so tests mock `ResizeObserver` and pass explicit sizes.
