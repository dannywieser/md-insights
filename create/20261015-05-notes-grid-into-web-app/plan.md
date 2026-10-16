# plan: notes grid into web app

## Goal

Replace the hello-world card on the web app's landing page with a full width/height, edge-to-edge,
headerless card that holds the `NoteGrid`, populated with 5000 random fake notes. The grid fills
the card and resizes with the window. Fake data is temporary and will be replaced with real notes.

## Scope

In:
- `NoteGrid` fills its container when `height` is omitted (measures width and height).
- Fake-note generator (random titles/colours) in `packages/ui`.
- Web app landing page: card below `AppHeader` filling the viewport, containing the grid, 5000 notes.
- Tests for the above; design board keeps working with its fixed-height grid.

Out:
- Real note loading, service, Electron app.
- Search, selection, click handling on notes.
- Changes to the design board demo (it keeps its fixed `height` default).

## Technologies

- React 19 + Vite, Tailwind v4, Vitest + Testing Library (all existing).
- `ResizeObserver` (already used by `useElementWidth`) to track container size.
- No new dependencies.

## Repository structure

```
packages/ui/
  src/
    components/note-grid.tsx        (modify)
    lib/use-element-size.ts         (new, replaces use-element-width.ts)
    lib/fake-notes.ts               (new)
    index.ts                        (modify)
  tests/
    note-grid.test.tsx              (modify)
    use-element-size.test.tsx       (new, replaces use-element-width.test.tsx)
    fake-notes.test.ts              (new)
apps/web/
  src/App.tsx                       (modify)
  tests/App.test.tsx                (modify)
```

## Files

- `packages/ui/src/lib/use-element-size.ts` - hook returning `{ width, height }` of an element (clientWidth/clientHeight) kept current via ResizeObserver; replaces `use-element-width.ts`.
- `packages/ui/src/lib/use-element-width.ts` - deleted (only NoteGrid uses it).
- `packages/ui/src/components/note-grid.tsx` - `height` becomes optional with no default: when set, root keeps the inline fixed height as today; when omitted, root is `h-full` and the measured height feeds `layoutGrid`. Renders the grid only once the size is non-zero.
- `packages/ui/src/lib/fake-notes.ts` - `makeFakeNotes(count)` returning `Note[]` with ids `note-<i>`, random lorem-style titles and random colours in `0..NOTE_COLORS-1`.
- `packages/ui/src/index.ts` - export `makeFakeNotes`.
- `apps/web/src/App.tsx` - `main` is flex-1 with `min-h-0` and padding; a `Card` with `flex-1 min-h-0 p-0 overflow-hidden` wraps `<NoteGrid notes={notes} />`; notes created once (`useMemo`/module-level state, not re-randomised per render).
- `packages/ui/tests/*`, `apps/web/tests/App.test.tsx` - see Steps.

## Steps

1. `use-element-size` hook: write it, move/adapt its test (mock clientWidth and clientHeight), delete the old hook and test.
2. `NoteGrid`: use the size hook; optional `height`; fill-container mode. Update `note-grid.test.tsx` for both fixed-height and fill modes (mock sizes). Check the design board still renders with the default.
   - Decision to settle here: the previous default of `height = 320` is removed, so the design board demo must pass `height={320}` explicitly to keep its look.
3. `fake-notes.ts` + export + test (count, unique ids, colours in range, titles non-empty).
4. Web app: rewrite `App.tsx` with the full-height card and grid of 5000 fake notes; update `App.test.tsx` (header present, grid labelled "5000 notes" present with mocked sizes).
5. Run `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`; check `pnpm dev` visually (fill, resize, hover tooltip with 5000 notes), and the design board.
6. Guidelines/CLAUDE.md: no decision changes expected; update only if the layout guideline needs a note.

## Open questions / risks

- Card layout: the `Card` has a hard shadow and crop marks; edge to edge means no inner padding, but the page still needs outer padding so the shadow/crop marks aren't clipped. I'll keep a page-level `p-6` and make the card itself fill the rest.
- jsdom has no layout, so tests must mock `clientWidth`/`clientHeight` (as the existing width test does).
- Removing the `height` default touches the design board demo (one prop); low risk.
- Tailwind `h-full` needs every ancestor to have a definite height; the `flex-1 min-h-0` chain from the root `min-h-screen` container may need `h-screen` instead so the card can't grow past the viewport.
