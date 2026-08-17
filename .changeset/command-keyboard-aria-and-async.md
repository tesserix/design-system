---
"@tesserix/web": minor
---

Fix five defects in `Command` that made it unusable as a real command palette, and give `CommandPalette` what an async palette needs.

- **Keyboard navigation now works from the search input.** The `ArrowDown`/`ArrowUp`/`Enter` handler lived on `CommandList`, a *sibling* of `CommandInput`, so keystrokes from the input — where focus sits for a palette's whole life — never reached it. It moves to the `Command` wrapper, an ancestor of both.
- **`Enter` can no longer act on a stale selection.** The active value was written synchronously from a registry that items only populate in an effect, so after typing it could point at an item no longer on screen. The highlight is now reconciled against the current match set, and `Enter` re-checks membership before firing.
- **`CommandEmpty` no longer contradicts the list.** Emptiness meant "nothing selectable", so a list of matching-but-`disabled` items rendered the items *and* "no results". It now means "nothing rendered".
- **The combobox pattern is complete.** `CommandInput` declares `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-autocomplete`, and points `aria-activedescendant` at the highlighted option — which was the missing piece that left arrowing silent for screen readers. Options carry stable ids.
- **`CommandPalette` supports server-driven search** via `query`/`onQueryChange`, `loading`, and `shouldFilter`, and now routes selection through `onValueChange` so `Enter` triggers an item's `onSelect` rather than only a mouse click.

Arrow navigation also skips `disabled` items, and the new `CommandLoading` part is exported.

Note for consumers: `CommandInput` now has `role="combobox"`, so a test querying it by `getByRole("textbox")` must query `getByRole("combobox")` instead.

The item registry is also mirrored into a ref so keyboard handlers read the live list rather than the snapshot their render closed over — a key pressed in the same tick as mount previously did nothing.
