# Plan: focus border in notes grid

## Goal
When the hovered grid square is on the edge of the grid, its outline currently merges with the grid border (both are 2px `#000`) and looks like one thick line. Make the hover outline thicker than the border, still black, centred on the cell edge so on edge cells it visibly extends past the grid border.

## Scope
- In: hover outline (`.note-hover`) stroke width; letting it draw outside the SVG box; a test; the design-board guideline if it mentions the outline.
- Out: keyboard focus (cells are not focusable), colour changes (stays `#000` in both themes), layout/sizing of the grid, `layoutGrid`.

## Technologies
Existing React + SVG + Tailwind v4 CSS in `packages/ui`; Vitest + Testing Library. No new dependencies.

## Repository structure
No new files; changes only in existing ones.

## Files
- `packages/ui/src/styles/globals.css` - raise `.note-hover` `stroke-width` (start at 4) and update its comment.
- `packages/ui/src/components/note-grid.tsx` - add `overflow-visible` to the `<svg>` so the outline is not clipped at the SVG edge (no padding, so layout/`inset` maths are unchanged); keep the outline as the last child so it paints above the border.
- `packages/ui/tests/note-grid.test.tsx` - assert the SVG allows overflow so an edge cell's outline is not clipped (jsdom cannot measure stroke widths).
- `apps/design/src/sections/Guidelines.tsx` - only if a guideline describes the hover outline; update it.

## Steps
1. Increase `.note-hover` stroke width in `globals.css`.
2. Add `overflow-visible` to the grid SVG in `note-grid.tsx`.
3. Add the test.
4. Run `pnpm dev`, hover corner/edge/interior cells in the browser, and tune the thickness with the user (single value in CSS).
5. Check the guidelines section; update if needed.
6. `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.

## Open questions / risks
- Final thickness needs eyeballing (4px is a starting guess).
- Ancestors with `overflow: hidden` (e.g. the card frame on the landing page) could still clip the outward part; check in step 4. If so, add a little padding to the frame or drop to a smaller overshoot.
- Squares are whole pixels and the outline is centred on a gridline, so a thicker stroke also overlaps neighbouring cells by half its width; acceptable since it is the highlight.
