# @tesserix/otto-widget 0.6.0 — OttoInbox "platform mode"

## Goal

Give `OttoInbox` an opt-in, cross-tenant **platform mode** for the Tesserix
platform support inbox (tesserix-home admin), which sees Otto conversations
across every product at once. In platform mode each conversation row and the
thread header show a friendly product badge, and a tenant filter (chips)
derived from the conversations in view lets the operator narrow to one
product — composing with the existing Pending / Active / Closed tabs. The
default single-tenant behaviour (mark8ly admin and every other current
consumer) must stay byte-for-byte unchanged.

## Architecture (2-3 sentences)

`OttoInbox` already receives every conversation's `tenant_id` on the wire
(`Conversation.tenant_id` exists in `src/types.ts`) and the REST/WS shapes are
identical between the per-tenant admin surface and the platform surface — the
only difference is which proxy the host points `apiBaseUrl` at. Platform mode
is therefore a pure presentation layer inside the component: a new optional
`tenantLabels?: Record<string, string>` prop whose *presence* switches the
mode on, product badges rendered from `tenantLabels[tenant_id] ?? tenant_id`,
and a client-side tenant filter whose chips are derived from the tenant ids
present in the already-fetched list (no new endpoint, no wire change). The
widget continues to hardcode neither surface.

## Tech stack

- **Language:** TypeScript 5.9.2, React 19 (`react-jsx`), strict mode with
  `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess` all on
  (`packages/otto-widget/tsconfig.json`).
- **Package:** `@tesserix/otto-widget` (pnpm workspace member under
  `packages/otto-widget`), managed from the `design-system` monorepo root with
  pnpm 10.17.1 + turbo.
- **Styling:** hand-written scoped CSS in `src/styles/inbox.css` using a
  BEM-style `.otto-inbox__*` class scheme and `--otto-*` CSS custom properties.
- **Verification tooling:** the package has ONLY `type-check` (`tsc --noEmit`)
  and `lint` (`eslint . --max-warnings 0`) scripts. There is **no test
  runner** in the package or a package-level test script — do not add one.

---

## Global Constraints (read before starting)

- **Branch:** do all work on `feat/otto-inbox-platform-mode` (created off
  `main`). Never commit directly to `main`.
- **Git identity:** the remote is `github.com/tesserix/design-system`
  (contains `tesserix` → personal). Configure before the first commit:
  - `git config user.name "sam123ben"`
  - `git config user.email "samyak.rout@gmail.com"`
- **No AI references anywhere.** Never mention Claude, Copilot, Anthropic, any
  AI/LLM tool, or `Co-Authored-By` in commit messages, PR text, code comments,
  CHANGELOG, or any file content.
- **Conventional commits**, scope `otto-widget` (e.g.
  `feat(otto-widget): …`). One commit per task as specified.
- **Default single-tenant behaviour must not change.** Every platform-only
  branch is gated behind the new mode switch; when the prop is omitted the
  rendered output and all derived values are identical to today
  (verified by the Task 4 consumer-compat typecheck).
- **Do NOT publish.** Publishing 0.6.0 to GitHub Packages / npm is done by the
  USER or CI (this repo publishes via changesets / release workflow). This plan
  ends at the version-bump commit. Never run `npm publish`, `pnpm publish`,
  `changeset publish`, or `pnpm release`.
- **Do NOT add a changeset file.** This plan bumps `package.json` version and
  writes the CHANGELOG entry directly (Task 4). Adding a `.changeset/*.md` on
  top of a manual bump would double-bump when the release job later runs
  `changeset version`. If your team's release process *requires* a changeset
  instead of a manual bump, use one — but do not do both.
- **CLAUDE.md protection:** never create, edit, commit, or reference any
  CLAUDE.md file.

## Verification reality (be honest)

- `pnpm --filter @tesserix/otto-widget type-check` runs `tsc --noEmit`. **This
  is the real gate.** On success it prints the two npm banner lines and exits
  0 with no diagnostics.
- `pnpm --filter @tesserix/otto-widget lint` runs `eslint . --max-warnings 0`.
  **Confirmed limitation:** the package's `eslint.config.mjs` is a minimal flat
  config with no TypeScript parser and no `files` globs, so `eslint .` only
  processes the default `.js/.mjs/.cjs` globs — effectively just
  `eslint.config.mjs` itself. It does **not** lint the `.ts`/`.tsx` sources
  (verified: injecting broken TSX syntax + an unused var into a source file
  still exits 0). Run `lint` anyway (it is part of the repo contract and must
  stay green), but do not rely on it to catch TypeScript/JSX errors — rely on
  `type-check`.
- There is **no test runner**. Task 4 adds a compile-only *consumer-compat*
  typecheck fixture (`type-tests/consumer-compat.tsx` + `tsconfig.typetest.json`)
  that proves the public prop surface stays source-compatible for existing
  single-tenant callers and that platform mode type-checks. The fixture lives
  outside `src` and is not in `package.json` `files`, so it is never published.

## Design decisions (justification)

- **Mode switch = presence of `tenantLabels`.** Chosen over an explicit
  boolean because it is the smallest API that cannot be misconfigured: there is
  exactly one way to enable platform mode, and it can't disagree with the data
  it needs. `tenantLabels === undefined` → single-tenant (default);
  `tenantLabels` provided (even `{}`) → platform mode, with per-badge fallback
  to the raw tenant id.
- **Tenant filter is client-side, chips derived from the fetched list.** The
  existing status filter is wired server-side via `?status=` in `loadList`.
  The platform API also supports a `?tenant=` query param, but sending it
  server-side would collapse the very set of chips we must derive "from the
  tenant ids present in the fetched list" (you'd only ever get one tenant's
  rows back). The requirement explicitly permits client-side composition, so
  the filter is applied client-side against the already-fetched list; the chip
  set is derived from that same list and updates naturally on tab switch and WS
  inserts. (`?tenant=` remains available as a documented future server-side
  optimization, out of scope here.)
- **`Conversation.tenant_id` already exists** (`src/types.ts:47`) — no type
  change to the wire model is needed; this de-risks the whole feature to a
  presentation change.

---

## Setup (do once, before Task 1)

Run these from the monorepo root
`/Users/samyakrout/Desktop/samyak-work/projects/new-repos/design-system`.

- [ ] Create and switch to the feature branch off an up-to-date `main`:
```bash
cd /Users/samyakrout/Desktop/samyak-work/projects/new-repos/design-system
git checkout main
git pull --ff-only origin main
git checkout -b feat/otto-inbox-platform-mode
```
- [ ] Configure git identity (personal — remote contains `tesserix`):
```bash
git config user.name "sam123ben"
git config user.email "samyak.rout@gmail.com"
git config user.email    # expect: samyak.rout@gmail.com
```
- [ ] Install the package's dependencies (root `node_modules` is not present in
  a fresh clone; this scoped install pulls only what `@tesserix/otto-widget`
  needs — verified to complete in ~3s against the committed lockfile):
```bash
pnpm install --filter @tesserix/otto-widget... --prefer-offline
```
  Expected tail:
```
Lockfile is up to date, resolution step is skipped
...
Done in Xs using pnpm v10.17.1
```
- [ ] Establish the green baseline before touching anything:
```bash
pnpm --filter @tesserix/otto-widget type-check
pnpm --filter @tesserix/otto-widget lint
```
  Both must exit 0 with only their npm banner lines and no diagnostics.

---

## Task 1 — Add `tenantLabels` prop + product badges to `OttoInbox`

Introduce the mode switch and render the product badge on each row and in the
thread header. All new identifiers are consumed within this task (required —
`tsconfig` has `noUnusedLocals: true`, so a task that adds an unused local
would fail `type-check`).

### Files

- `packages/otto-widget/src/OttoInbox.tsx` (edit)
- `packages/otto-widget/src/index.ts` — **no edit needed**; it already
  re-exports the prop type via `export type { OttoInboxProps } from "./OttoInbox";`
  so the new field flows to consumers automatically.

### Interfaces produced

```ts
export interface OttoInboxProps {
  // …existing props unchanged…
  /** tenant id → friendly product name. Presence switches on platform mode. */
  tenantLabels?: Record<string, string>;
}
```

Component-internal (not exported):

```ts
const platformMode: boolean;                       // tenantLabels !== undefined
const productLabel: (tenantId: string) => string;  // tenantLabels?.[id] ?? id
```

### Steps

- [ ] **Edit 1a — add the prop to `OttoInboxProps`.** Locate the `onToast`
  prop and the interface's closing brace, and insert the new prop before it.

  Replace:
```tsx
  onToast?: (
    tone: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => void;
}
```
  with:
```tsx
  onToast?: (
    tone: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => void;
  /**
   * Cross-tenant "platform mode" for the Tesserix platform inbox
   * (tesserix-home admin). Map of tenant id → friendly product name.
   *
   * PRESENCE of this prop is the mode switch — there is no separate
   * boolean that could disagree with the data:
   *   - omitted  → single-tenant mode (default; byte-for-byte unchanged
   *                for existing consumers such as mark8ly admin)
   *   - provided → platform mode: a product badge on every row and in
   *                the thread header, plus a tenant filter derived from
   *                the tenant ids present in the fetched list.
   *
   * An empty object ({}) still enables platform mode; each badge then
   * falls back to the raw tenant id until labels are supplied.
   */
  tenantLabels?: Record<string, string>;
}
```

- [ ] **Edit 1b — destructure the new prop.** Replace:
```tsx
export function OttoInbox({
  apiBaseUrl = "/api/admin/otto",
  buildInboxWsUrl = DEFAULT_INBOX_WS,
  buildConversationWsUrl = DEFAULT_CONVERSATION_WS,
  currentUserId,
  style,
  className,
  onToast,
}: OttoInboxProps) {
```
  with:
```tsx
export function OttoInbox({
  apiBaseUrl = "/api/admin/otto",
  buildInboxWsUrl = DEFAULT_INBOX_WS,
  buildConversationWsUrl = DEFAULT_CONVERSATION_WS,
  currentUserId,
  style,
  className,
  onToast,
  tenantLabels,
}: OttoInboxProps) {
```

- [ ] **Edit 1c — derive `platformMode` and `productLabel`.** `useCallback`
  and `useMemo` are already imported (see the top-of-file import block).
  Replace:
```tsx
  const base = useMemo(() => apiBaseUrl.replace(/\/+$/, ""), [apiBaseUrl]);
  const [statusFilter, setStatusFilter] = useState<InboxStatus>("pending");
```
  with:
```tsx
  const base = useMemo(() => apiBaseUrl.replace(/\/+$/, ""), [apiBaseUrl]);
  // Platform mode is opt-in via the presence of tenantLabels. Kept as a
  // single derived boolean so every platform-only branch reads the same
  // switch and single-tenant consumers hit none of them.
  const platformMode = tenantLabels !== undefined;
  // Resolve a tenant id to its friendly product name, falling back to the
  // raw id when no label is mapped (or labels weren't supplied).
  const productLabel = useCallback(
    (tenantId: string) => tenantLabels?.[tenantId] ?? tenantId,
    [tenantLabels],
  );
  const [statusFilter, setStatusFilter] = useState<InboxStatus>("pending");
```

- [ ] **Edit 1d — product badge on each conversation row.** In the list, find
  the row's `otto-inbox__row-meta` block and prepend the badge (platform mode
  only). Replace:
```tsx
              <div className="otto-inbox__row-meta">
                <span className={`otto-inbox__pill otto-inbox__pill--${c.status}`}>
                  {c.status}
                </span>
```
  with:
```tsx
              <div className="otto-inbox__row-meta">
                {platformMode && (
                  <span className="otto-inbox__product" title={c.tenant_id}>
                    {productLabel(c.tenant_id)}
                  </span>
                )}
                <span className={`otto-inbox__pill otto-inbox__pill--${c.status}`}>
                  {c.status}
                </span>
```

- [ ] **Edit 1e — product name in the thread header.** Find the thread
  header's customer-name `<strong>` (the one using `selected.customer`,
  immediately followed by `otto-inbox__thread-subtitle`) and insert the badge
  between them. Replace:
```tsx
                <strong>
                  {selected.customer.name ||
                    selected.customer.email ||
                    "Anonymous visitor"}
                </strong>
                <div className="otto-inbox__thread-subtitle">
```
  with:
```tsx
                <strong>
                  {selected.customer.name ||
                    selected.customer.email ||
                    "Anonymous visitor"}
                </strong>
                {platformMode && (
                  <div className="otto-inbox__thread-product">
                    <span
                      className="otto-inbox__product"
                      title={selected.tenant_id}
                    >
                      {productLabel(selected.tenant_id)}
                    </span>
                  </div>
                )}
                <div className="otto-inbox__thread-subtitle">
```

### Verify

```bash
cd /Users/samyakrout/Desktop/samyak-work/projects/new-repos/design-system
pnpm --filter @tesserix/otto-widget type-check
pnpm --filter @tesserix/otto-widget lint
```
Expected: both exit 0. `type-check` prints:
```
> @tesserix/otto-widget@0.5.4 type-check …
> tsc --noEmit
```
and nothing else (no TS errors). `lint` prints its banner and exits 0.

### Commit

```bash
git add packages/otto-widget/src/OttoInbox.tsx
git commit -m "feat(otto-widget): add platform-mode product badges to OttoInbox"
```

---

## Task 2 — Add the client-side tenant filter

Add the tenant filter state, the derived chip set and the visible-rows
derivation, render the chip row, and switch the list to render the filtered
rows. Every identifier added here is consumed here (keeps `type-check` green
under `noUnusedLocals`).

### Files

- `packages/otto-widget/src/OttoInbox.tsx` (edit)

### Interfaces produced (component-internal)

```ts
const [tenantFilter, setTenantFilter] = useState<string | null>(null); // null = All
const tenantIds: string[];              // sorted unique tenant ids in the list
const visibleConversations: Conversation[]; // === conversations when not filtering
```

### Steps

- [ ] **Edit 2a — tenant-filter state.** Replace:
```tsx
  const [statusFilter, setStatusFilter] = useState<InboxStatus>("pending");
  const [conversations, setConversations] = useState<Conversation[]>([]);
```
  with:
```tsx
  const [statusFilter, setStatusFilter] = useState<InboxStatus>("pending");
  // Platform-mode tenant filter (null = "All"). Independent of the status
  // tabs so the two compose. Applied client-side against the already-fetched
  // list — no new endpoint, and it can't collapse the set of tenant chips we
  // derive from that same list.
  const [tenantFilter, setTenantFilter] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
```

- [ ] **Edit 2b — derive `tenantIds` and `visibleConversations`.** Find the
  `selected` derivation and insert the two memos after it. Replace:
```tsx
  const selected =
    conversations.find((c) => c.id === selectedId) ?? selectedConv ?? null;
```
  with:
```tsx
  const selected =
    conversations.find((c) => c.id === selectedId) ?? selectedConv ?? null;

  // Platform mode: the tenant filter chips are derived from the tenant ids
  // present in the currently-fetched list — no extra endpoint. The set
  // updates naturally as the list changes (tab switch, WS inserts).
  const tenantIds = useMemo(() => {
    if (!platformMode) return [] as string[];
    const seen = new Set<string>();
    for (const c of conversations) {
      if (c.tenant_id) seen.add(c.tenant_id);
    }
    return Array.from(seen).sort();
  }, [platformMode, conversations]);

  // Rows actually rendered. In single-tenant mode this is the list itself
  // (same reference), so default rendering is unchanged. In platform mode
  // with a tenant selected it filters client-side.
  const visibleConversations = useMemo(
    () =>
      platformMode && tenantFilter
        ? conversations.filter((c) => c.tenant_id === tenantFilter)
        : conversations,
    [platformMode, tenantFilter, conversations],
  );
```

- [ ] **Edit 2c — render the tenant-filter chip row and switch the empty
  check.** Find the end of the `otto-inbox__tabs` block and the line that
  begins the list's empty/populated ternary. Replace:
```tsx
        <div className="otto-inbox__tabs">
          {(["pending", "active", "closed"] as InboxStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`otto-inbox__tab ${statusFilter === s ? "is-active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {conversations.length === 0 ? (
```
  with:
```tsx
        <div className="otto-inbox__tabs">
          {(["pending", "active", "closed"] as InboxStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`otto-inbox__tab ${statusFilter === s ? "is-active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {platformMode && tenantIds.length > 0 && (
          <div
            className="otto-inbox__tenant-filter"
            role="group"
            aria-label="Filter by product"
          >
            <button
              type="button"
              className={`otto-inbox__tenant-chip ${tenantFilter === null ? "is-active" : ""}`}
              onClick={() => setTenantFilter(null)}
            >
              All
            </button>
            {tenantIds.map((t) => (
              <button
                key={t}
                type="button"
                className={`otto-inbox__tenant-chip ${tenantFilter === t ? "is-active" : ""}`}
                onClick={() => setTenantFilter(t)}
                title={t}
              >
                {productLabel(t)}
              </button>
            ))}
          </div>
        )}
        {visibleConversations.length === 0 ? (
```

- [ ] **Edit 2d — render the filtered rows.** Find the populated branch of
  that ternary (the `conversations.map((c) => (…))` that opens the row button)
  and switch it to `visibleConversations`. Replace:
```tsx
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`otto-inbox__row ${c.id === selectedId ? "is-active" : ""}`}
```
  with:
```tsx
        ) : (
          visibleConversations.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`otto-inbox__row ${c.id === selectedId ? "is-active" : ""}`}
```

### Verify

```bash
cd /Users/samyakrout/Desktop/samyak-work/projects/new-repos/design-system
pnpm --filter @tesserix/otto-widget type-check
pnpm --filter @tesserix/otto-widget lint
```
Expected: both exit 0, no diagnostics. (If `type-check` reports an unused
`tenantIds`/`visibleConversations`, Edit 2c/2d weren't applied — the values
must be referenced by the render.)

### Commit

```bash
git add packages/otto-widget/src/OttoInbox.tsx
git commit -m "feat(otto-widget): add tenant filter to OttoInbox platform mode"
```

---

## Task 3 — Style the badges and tenant filter

Add the platform-mode styles to `inbox.css`, following the file's existing
`.otto-inbox__*` class scheme and `--otto-*` custom properties.

### Files

- `packages/otto-widget/src/styles/inbox.css` (edit)

### Interfaces consumed (class names emitted by Tasks 1-2)

`otto-inbox__product`, `otto-inbox__thread-product`,
`otto-inbox__tenant-filter`, `otto-inbox__tenant-chip`,
`otto-inbox__tenant-chip.is-active`.

### Steps

- [ ] **Edit 3a — add two tokens to the `.otto-inbox` variable block.**
  Replace:
```css
  --otto-pill-pending: #fde68a;
  --otto-pill-active: #bbf7d0;
  --otto-pill-closed: #e5e7eb;
```
  with:
```css
  --otto-pill-pending: #fde68a;
  --otto-pill-active: #bbf7d0;
  --otto-pill-closed: #e5e7eb;
  --otto-product-bg: #eef2ff;
  --otto-product-fg: #3730a3;
```

- [ ] **Edit 3b — append the platform-mode rules at the end of the file.**
  Find the final keyframes block and append the new section after it. Replace:
```css
@keyframes otto-toast-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
  with:
```css
@keyframes otto-toast-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Platform mode — product badges + tenant filter ───────────────── */
/* Rendered only when OttoInbox runs in platform mode (the host passed
   tenantLabels). Uses the same token scheme + chip styling as the rest of
   the inbox so it drops in without a visual seam. */
.otto-inbox__tenant-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--otto-border);
  background: var(--otto-surface);
}

.otto-inbox__tenant-chip {
  padding: 4px 10px;
  border: 1px solid var(--otto-border);
  border-radius: 999px;
  background: var(--otto-surface-muted);
  color: var(--otto-text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.otto-inbox__tenant-chip:hover {
  background: var(--otto-surface);
  color: var(--otto-text);
}

.otto-inbox__tenant-chip.is-active {
  background: var(--otto-product-bg);
  color: var(--otto-product-fg);
  border-color: var(--otto-product-fg);
}

.otto-inbox__product {
  display: inline-block;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--otto-product-bg);
  color: var(--otto-product-fg);
}

.otto-inbox__thread-product {
  margin-top: 4px;
}
```

### Verify

CSS is covered by neither `type-check` nor `lint` (eslint doesn't process CSS,
tsc ignores it). Verify instead that (a) the two gates still pass unchanged and
(b) every platform-mode class the component emits now has a rule, and vice
versa:

```bash
cd /Users/samyakrout/Desktop/samyak-work/projects/new-repos/design-system
pnpm --filter @tesserix/otto-widget type-check   # exit 0
pnpm --filter @tesserix/otto-widget lint          # exit 0

# Every new class must appear in BOTH files:
grep -nE "otto-inbox__(product|thread-product|tenant-filter|tenant-chip)" \
  packages/otto-widget/src/styles/inbox.css
grep -nE "otto-inbox__(product|thread-product|tenant-filter|tenant-chip)" \
  packages/otto-widget/src/OttoInbox.tsx
```
Expected: the CSS grep lists the `.otto-inbox__tenant-filter`,
`.otto-inbox__tenant-chip`, `.otto-inbox__tenant-chip.is-active`,
`.otto-inbox__product`, and `.otto-inbox__thread-product` rules; the TSX grep
lists the matching `className=` references from Tasks 1-2. No class appears in
only one file.

### Commit

```bash
git add packages/otto-widget/src/styles/inbox.css
git commit -m "feat(otto-widget): style platform-mode badges and tenant filter"
```

---

## Task 4 — Version bump, CHANGELOG, README, and consumer-compat check

Bump the package to 0.6.0, document platform mode, and add a compile-only
consumer-compat fixture that proves the default prop surface is unchanged and
platform mode type-checks. This is the final commit; do not publish.

### Files

- `packages/otto-widget/package.json` (edit — version)
- `packages/otto-widget/CHANGELOG.md` (edit — new 0.6.0 entry at top)
- `packages/otto-widget/README.md` (edit — new platform-mode section)
- `packages/otto-widget/type-tests/consumer-compat.tsx` (create)
- `packages/otto-widget/tsconfig.typetest.json` (create)

### Steps

- [ ] **Edit 4a — bump the version.** In `packages/otto-widget/package.json`,
  replace:
```json
  "version": "0.5.4",
```
  with:
```json
  "version": "0.6.0",
```

- [ ] **Edit 4b — CHANGELOG entry.** In `packages/otto-widget/CHANGELOG.md`,
  insert the 0.6.0 section between the title and the 0.5.4 heading. Replace:
```markdown
# @tesserix/otto-widget

## 0.5.4
```
  with:
```markdown
# @tesserix/otto-widget

## 0.6.0

### Minor Changes

- OttoInbox platform mode: opt-in cross-tenant view for the Tesserix
  platform inbox (tesserix-home admin).

  Pass `tenantLabels` (a map of tenant id → friendly product name) to switch
  `OttoInbox` into platform mode. The presence of the prop is the only
  switch — omit it and behaviour is byte-for-byte unchanged for existing
  single-tenant consumers (mark8ly admin).

  In platform mode:

  - every conversation row shows a product badge (friendly label, falling
    back to the raw tenant id);
  - a tenant filter (chips) appears, derived from the tenant ids present in
    the fetched list — no new endpoint — and composes with the existing
    Pending / Active / Closed tabs, filtered client-side;
  - the thread header shows the product name of the open conversation.

  No wire/API changes: conversations already carry `tenant_id`, and the
  REST/WS shapes are identical between the tenant-admin and platform
  surfaces. The consumer just points `apiBaseUrl` at the platform proxy.

## 0.5.4
```

- [ ] **Edit 4c — README section.** In `packages/otto-widget/README.md`,
  insert a platform-mode section immediately before the `## Theming` heading.
  Replace `## Theming` with the block below (note: the block below contains a
  fenced `tsx` example — copy it verbatim into the README, keeping the inner
  triple-backtick fences):

````markdown
## Platform mode (v0.6.0)

`OttoInbox` has an opt-in **platform mode** for a cross-tenant inbox (the
Tesserix platform console in tesserix-home admin, which sees conversations
across every product). Pass `tenantLabels` — a map of tenant id → friendly
product name — and the presence of that prop switches the mode on:

```tsx
<OttoInbox
  apiBaseUrl="/api/admin/otto"        // point at the PLATFORM proxy
  buildInboxWsUrl={() => `${wsProto()}://${location.host}/api/v1/admin/otto/ws`}
  buildConversationWsUrl={(id) =>
    `${wsProto()}://${location.host}/api/v1/admin/otto/conversations/${id}/ws`
  }
  currentUserId={staffUserId}
  tenantLabels={{
    homechef: "HomeChef",
    fanzone: "FanZone",
    stockpilot: "StockPilot",
  }}
/>
```

In platform mode:

- **Product badge** on every conversation row and in the thread header
  (friendly label, falling back to the raw tenant id for any tenant not in
  `tenantLabels`).
- **Tenant filter** chips derived from the tenant ids present in the fetched
  list (no extra endpoint). Selecting one filters the rows client-side; it
  composes with the Pending / Active / Closed tabs.

Omit `tenantLabels` and the inbox behaves exactly as before — single tenant,
no badges, no filter. An empty object (`tenantLabels={{}}`) still enables the
mode; every badge then shows the raw tenant id.

The widget never hardcodes either surface: the same component renders the
per-tenant admin inbox and the platform inbox. The only difference is the
`apiBaseUrl` (which proxy the host points at) and whether `tenantLabels` is
passed. Conversations already carry `tenant_id` on the wire, so no backend
change is required.

## Theming
````

- [ ] **Edit 4d — create the consumer-compat fixture.** Create
  `packages/otto-widget/type-tests/consumer-compat.tsx` with exactly:
```tsx
// Compile-only regression guard (not shipped — see package.json "files").
// Proves the OttoInbox public prop surface stays source-compatible for
// existing single-tenant consumers, and that platform mode type-checks.
import { OttoInbox } from "../src/index";

// 1. Legacy single-tenant usage (mark8ly admin) — existing props only.
//    Must keep compiling with no changes.
export function LegacyConsumer() {
  return (
    <OttoInbox
      apiBaseUrl="/api/admin/otto"
      buildInboxWsUrl={() => "wss://example/api/v1/admin/otto/ws"}
      buildConversationWsUrl={(id) =>
        `wss://example/api/v1/admin/otto/conversations/${id}/ws`
      }
      currentUserId="staff-1"
      onToast={(_tone, _title, _desc) => {}}
    />
  );
}

// 2. Minimal legacy usage — only the required prop.
export function MinimalConsumer() {
  return <OttoInbox currentUserId="staff-1" />;
}

// 3. Platform-mode usage — tenantLabels present.
export function PlatformConsumer() {
  return (
    <OttoInbox
      apiBaseUrl="/api/admin/otto"
      currentUserId="staff-1"
      tenantLabels={{ homechef: "HomeChef", fanzone: "FanZone" }}
    />
  );
}

// 4. Platform-mode with empty labels (opt-in, raw ids as fallback).
export function PlatformEmptyLabels() {
  return <OttoInbox currentUserId="staff-1" tenantLabels={{}} />;
}
```

- [ ] **Edit 4e — create the fixture tsconfig.** Create
  `packages/otto-widget/tsconfig.typetest.json` with exactly:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src", "type-tests"]
}
```
  Notes: `extends` inherits strict + JSX + `noUncheckedIndexedAccess` from the
  base config; the child `include` replaces the base's `["src"]` to add
  `type-tests`; `noEmit` overrides the base `outDir`/`declaration` so nothing is
  written. Neither `type-tests/` nor `tsconfig.typetest.json` is listed in
  `package.json` `files` (`["src", "README.md"]`), so neither is published, and
  the normal `type-check` script (base tsconfig, `include: ["src"]`) does not
  pick up the fixture — the compat check is a separate, explicit invocation.

### Verify

```bash
cd /Users/samyakrout/Desktop/samyak-work/projects/new-repos/design-system

# Version bumped:
grep '"version"' packages/otto-widget/package.json    # expect: "version": "0.6.0",

# Standard gates still green:
pnpm --filter @tesserix/otto-widget type-check
pnpm --filter @tesserix/otto-widget lint

# Consumer-compat: default AND platform usages must type-check.
pnpm --filter @tesserix/otto-widget exec tsc -p tsconfig.typetest.json
echo "compat exit: $?"    # expect: compat exit: 0
```
Expected: `type-check` and `lint` exit 0; the `tsc -p tsconfig.typetest.json`
run prints nothing and exits 0 (`compat exit: 0`). A non-zero exit means the
public prop surface drifted (a legacy call site broke) or platform mode has a
type error — fix `OttoInbox.tsx`, not the fixture, before proceeding.

### Commit

```bash
git add packages/otto-widget/package.json \
        packages/otto-widget/CHANGELOG.md \
        packages/otto-widget/README.md \
        packages/otto-widget/type-tests/consumer-compat.tsx \
        packages/otto-widget/tsconfig.typetest.json
git commit -m "feat(otto-widget): 0.6.0 — document and version OttoInbox platform mode"
```

**Stop here.** Publishing 0.6.0 is the user's / CI's job. Do not run any
publish command. If a PR is desired, open it from `feat/otto-inbox-platform-mode`
into `main` with a description summarizing the four commits (no AI references).

---

## Final self-check (run after all four tasks)

- [ ] `git log --oneline main..HEAD` shows exactly the four `feat(otto-widget):`
  commits, in order, and `git config user.email` is `samyak.rout@gmail.com`.
- [ ] `git status` is clean (no stray files; the fixture + tsconfig are the only
  new tracked files, both committed).
- [ ] `grep -rniE "claude|anthropic|copilot|co-authored" packages/otto-widget`
  returns nothing.
- [ ] All three verify commands pass: `type-check`, `lint`, and
  `tsc -p tsconfig.typetest.json`.
- [ ] Sanity: `git show <task-1-commit>:packages/otto-widget/src/OttoInbox.tsx |
  grep -c "platformMode"` is > 0, confirming the switch is present.
