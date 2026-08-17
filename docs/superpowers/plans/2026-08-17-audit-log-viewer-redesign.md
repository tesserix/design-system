# AuditLogViewer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `@tesserix/web`'s `AuditLogViewer` as a hybrid data-driven + composable component with per-entry expand/collapse, fixing seven accessibility and correctness defects, without breaking its one production consumer.

**Architecture:** The current 92-line single file splits into a context module, a parts module, and a thin data-driven wrapper composed from those parts. Every new capability (disclosure, severity, loading, selection, localization) is an optional prop or an optional `AuditLogEntry` field, so the existing `entries`-driven call in the Tesserix console keeps working untouched. The nine existing vitest cases must pass **unmodified** at every task boundary — that is the backward-compatibility proof.

**Tech Stack:** React 19, TypeScript 5.7, Tailwind CSS v4, vitest 4 + @testing-library/react 16, Storybook (test-runner in CI), tsup (`bundle: false`), changesets, pnpm workspaces, turbo.

**Spec:** `docs/superpowers/specs/2026-08-17-audit-log-viewer-redesign-design.md`

## Global Constraints

- **Package:** all source changes live under `packages/web/`. Run commands from `packages/web/` unless stated otherwise.
- **Version:** `@tesserix/web` is at `2.2.1`. This ships as a **minor** (`2.3.0`) via a changeset. Never hand-edit `version` in `package.json`.
- **Backward compatibility:** `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx`'s original nine cases must pass **unmodified**. Add new cases; never edit or delete an existing one. If an existing case fails, the implementation is wrong — not the test.
- **Existing stories** (`Default`, `Empty`, `Selectable`, `MergedSources`, `FormattedMetadata`, `SmokeTest`) must render and pass unchanged.
- **Console consumer** (`tesserix-home/apps/console/.../audit-timeline.tsx`) passes only `entries`, `emptyMessage`, `renderSource`, `renderMetadata` and deliberately omits `onEntrySelect`. A row must stay a plain non-focusable element when `onEntrySelect` is absent, and must render no chevron when the entry has no detail.
- **Metadata placement:** `metadata` renders **inline**, exactly as today. Never move it into the collapsed detail.
- **Immutability:** never mutate state. New `Set`/array per change (project coding-style rule).
- **File size:** target 200–400 lines per file, 800 max.
- **Focus ring tokens** (copy verbatim from `button.tsx:8`): `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- **Icons:** `ChevronDown` from `@tesserix/icons/web`. `lucide-react` goes in web's `peerDependencies` as `^0.469.0` (mirroring `@tesserix/icons`). Never bundle it.
- **No `any`.** Exported APIs get explicit types. No `console.log`.
- **Colour is never the only signal** — every severity/state also carries text.
- **Commit style:** conventional commits, single-line message, no signature, no `--signoff`, no `-S`.
- **Root element — deliberate deviation from the spec.** Spec §5 says "Root is a `<section>` labelled by the heading". This plan keeps the root a plain `<div>` and puts the labelling on the `<ol>` (`aria-labelledby`, Task 2) instead. Reason: `AuditLogViewerProps extends React.HTMLAttributes<HTMLDivElement>` and the component forwards a `HTMLDivElement` ref, so switching to `<section>` would change the exported ref type — a type-level break in a release that is otherwise a clean minor. The accessibility goal (the entry list is programmatically named by the visible heading) is fully met either way. Do not "fix" this to a `<section>`.
- **Docs:** `apps/docs/content/web-components/audit-log-viewer.mdx` is GENERATED. `pnpm docs:generate` destroys hand-written prose in it. Put documentation in JSDoc on exported types/parts. Never hand-edit that MDX.

---

## File Structure

| File | Responsibility |
|---|---|
| `packages/web/src/components/audit-log-viewer/audit-log-context.tsx` (create) | Viewer + row context, expansion state hook, `AuditLogLabels`, defaults |
| `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx` (create) | The 14 exported presentational parts |
| `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx` (modify) | `AuditLogEntry`, `AuditLogViewerProps`, the data-driven wrapper composed from parts, dot-notation aliases |
| `packages/web/src/components/audit-log-viewer/index.ts` (modify) | Barrel — parts, types, wrapper |
| `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (modify, append only) | Behaviour tests |
| `packages/web/src/components/audit-log-viewer/audit-log-viewer.stories.tsx` (modify, append only) | Stories + play functions |
| `packages/web/package.json` (modify) | `@tesserix/icons` dependency, `lucide-react` peer |
| `.changeset/audit-log-viewer-redesign.md` (create) | Minor release note |

---

### Task 1: Split into parts, behaviour-identical

Pure structural refactor. No new props, no visual change. Proves the parts can reproduce today's output exactly.

**Files:**
- Create: `packages/web/src/components/audit-log-viewer/audit-log-context.tsx`
- Create: `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx` (full rewrite)
- Modify: `packages/web/src/components/audit-log-viewer/index.ts`
- Test: `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (append)

**Interfaces:**
- Consumes: nothing.
- Produces: `AuditLogViewerContext`, `useAuditLogViewer(): AuditLogViewerContextValue`, `AuditLogRowContext`, `useAuditLogRow(): AuditLogRowContextValue`; parts `AuditLogRoot`, `AuditLogHeader`, `AuditLogTitle`, `AuditLogCount`, `AuditLogList`, `AuditLogRow`, `AuditLogSummary`, `AuditLogTime`, `AuditLogSource`, `AuditLogMetadata`, `AuditLogEmpty`; unchanged `AuditLogEntry`, `AuditLogViewerProps`, `AuditLogViewer` (now with dot aliases `.Root`, `.Header`, `.Title`, `.Count`, `.List`, `.Row`, `.Summary`, `.Time`, `.Source`, `.Metadata`, `.Empty`).

- [ ] **Step 1: Confirm the green baseline before touching anything**

Run from `packages/web/`:
```bash
npx vitest run src/components/audit-log-viewer
```
Expected: `Test Files 1 passed (1)`, `Tests 9 passed (9)`. If this is not green, STOP and report — the whole plan's compatibility proof rests on it.

- [ ] **Step 2: Write the failing composition test**

Append to `audit-log-viewer.test.tsx`:

```tsx
describe("AuditLogViewer parts", () => {
  it("composes an equivalent list from the exported parts", () => {
    render(
      <AuditLogRoot>
        <AuditLogHeader>
          <AuditLogTitle>Audit Log</AuditLogTitle>
          <AuditLogCount>1 entry</AuditLogCount>
        </AuditLogHeader>
        <AuditLogList>
          <AuditLogRow entryId="1">
            <AuditLogSummary>
              Mahesh updated settings
              <AuditLogTime>2026-02-24</AuditLogTime>
            </AuditLogSummary>
          </AuditLogRow>
        </AuditLogList>
      </AuditLogRoot>
    )

    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getByRole("listitem")).toHaveTextContent("Mahesh updated settings")
    expect(screen.getByText("1 entry")).toBeInTheDocument()
  })

  it("exposes the parts as dot-notation aliases on AuditLogViewer", () => {
    expect(AuditLogViewer.Root).toBe(AuditLogRoot)
    expect(AuditLogViewer.Row).toBe(AuditLogRow)
    expect(AuditLogViewer.Summary).toBe(AuditLogSummary)
  })

  it("throws a clear error when a row is used outside a root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<AuditLogSummary>orphan</AuditLogSummary>)).toThrow(
      /must be used within/i
    )
    spy.mockRestore()
  })
})
```

Extend the file's existing import to pull in the new names:

```tsx
import {
  AuditLogViewer,
  AuditLogRoot,
  AuditLogHeader,
  AuditLogTitle,
  AuditLogCount,
  AuditLogList,
  AuditLogRow,
  AuditLogSummary,
  AuditLogTime,
} from "./audit-log-viewer"
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npx vitest run src/components/audit-log-viewer
```
Expected: FAIL — `AuditLogRoot` is not exported / is not a function. The original nine still pass.

- [ ] **Step 4: Create the context module**

`audit-log-context.tsx`:

```tsx
import * as React from "react"

/** Every user-visible string the viewer renders. Override to localize. */
export interface AuditLogLabels {
  title: string
  countLabel: (count: number) => string
  expand: string
  collapse: string
  empty: string
}

export const defaultAuditLogLabels: AuditLogLabels = {
  title: "Audit Log",
  countLabel: (count) => `${count} ${count === 1 ? "entry" : "entries"}`,
  expand: "Show details",
  collapse: "Hide details",
  empty: "No audit entries",
}

export interface AuditLogViewerContextValue {
  labels: AuditLogLabels
  onEntrySelect?: (entryId: string) => void
}

const AuditLogViewerContext = React.createContext<AuditLogViewerContextValue | undefined>(undefined)

export const AuditLogViewerProvider = AuditLogViewerContext.Provider

export function useAuditLogViewer(): AuditLogViewerContextValue {
  const context = React.useContext(AuditLogViewerContext)
  if (!context) {
    throw new Error("AuditLog parts must be used within AuditLogRoot")
  }
  return context
}

export interface AuditLogRowContextValue {
  entryId: string
  summaryId: string
}

const AuditLogRowContext = React.createContext<AuditLogRowContextValue | undefined>(undefined)

export const AuditLogRowProvider = AuditLogRowContext.Provider

export function useAuditLogRow(): AuditLogRowContextValue {
  const context = React.useContext(AuditLogRowContext)
  if (!context) {
    throw new Error("AuditLog row parts must be used within AuditLogRow")
  }
  return context
}
```

- [ ] **Step 5: Create the parts module**

`audit-log-parts.tsx`. Class strings are copied verbatim from the current `audit-log-viewer.tsx` so output is byte-identical.

```tsx
import * as React from "react"

import { cn } from "../../lib/utils"
import {
  AuditLogRowProvider,
  AuditLogViewerProvider,
  defaultAuditLogLabels,
  useAuditLogRow,
  useAuditLogViewer,
  type AuditLogLabels,
} from "./audit-log-context"

export const AUDIT_LOG_ROW_CLASSNAME = "w-full rounded-md border p-3 text-left"

export interface AuditLogRootProps extends React.HTMLAttributes<HTMLDivElement> {
  labels?: Partial<AuditLogLabels>
  onEntrySelect?: (entryId: string) => void
}

/** The card container. Owns viewer-wide context for every nested part. */
const AuditLogRoot = React.forwardRef<HTMLDivElement, AuditLogRootProps>(
  ({ className, labels, onEntrySelect, children, ...props }, ref) => {
    const mergedLabels = React.useMemo<AuditLogLabels>(
      () => ({ ...defaultAuditLogLabels, ...labels }),
      [labels]
    )
    const value = React.useMemo(
      () => ({ labels: mergedLabels, onEntrySelect }),
      [mergedLabels, onEntrySelect]
    )

    return (
      <AuditLogViewerProvider value={value}>
        <div ref={ref} className={cn("space-y-3 rounded-xl border bg-card p-4", className)} {...props}>
          {children}
        </div>
      </AuditLogViewerProvider>
    )
  }
)
AuditLogRoot.displayName = "AuditLogRoot"

const AuditLogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between", className)} {...props} />
  )
)
AuditLogHeader.displayName = "AuditLogHeader"

const AuditLogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
  )
)
AuditLogTitle.displayName = "AuditLogTitle"

const AuditLogCount = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogCount.displayName = "AuditLogCount"

const AuditLogList = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} className={cn("space-y-2", className)} {...props} />
  )
)
AuditLogList.displayName = "AuditLogList"

export interface AuditLogRowProps extends React.LiHTMLAttributes<HTMLLIElement> {
  entryId: string
}

/** One entry. Provides row-scoped ids so summary and detail can reference each other. */
const AuditLogRow = React.forwardRef<HTMLLIElement, AuditLogRowProps>(
  ({ className, entryId, children, ...props }, ref) => {
    const reactId = React.useId()
    const value = React.useMemo(
      () => ({ entryId, summaryId: `${reactId}-summary` }),
      [entryId, reactId]
    )

    return (
      <AuditLogRowProvider value={value}>
        <li ref={ref} className={className} {...props}>
          {children}
        </li>
      </AuditLogRowProvider>
    )
  }
)
AuditLogRow.displayName = "AuditLogRow"

/**
 * The entry's main line. Renders a `<button>` only when the viewer has an
 * `onEntrySelect`; otherwise a plain `<div>`, so a viewer with no detail view
 * exposes no focusable control that does nothing.
 */
const AuditLogSummary = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const { onEntrySelect } = useAuditLogViewer()
    const { entryId, summaryId } = useAuditLogRow()

    if (!onEntrySelect) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          id={summaryId}
          className={cn(AUDIT_LOG_ROW_CLASSNAME, className)}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        id={summaryId}
        type="button"
        className={cn(AUDIT_LOG_ROW_CLASSNAME, "hover:bg-accent", className)}
        onClick={() => onEntrySelect(entryId)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
AuditLogSummary.displayName = "AuditLogSummary"

const AuditLogTime = React.forwardRef<HTMLTimeElement, React.TimeHTMLAttributes<HTMLTimeElement>>(
  ({ className, ...props }, ref) => (
    <time ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogTime.displayName = "AuditLogTime"

const AuditLogSource = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogSource.displayName = "AuditLogSource"

const AuditLogMetadata = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-1 text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogMetadata.displayName = "AuditLogMetadata"

const AuditLogEmpty = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { labels } = useAuditLogViewer()
    return (
      <p
        ref={ref}
        className={cn("rounded-md border border-dashed p-3 text-sm text-muted-foreground", className)}
        {...props}
      >
        {children ?? labels.empty}
      </p>
    )
  }
)
AuditLogEmpty.displayName = "AuditLogEmpty"

export {
  AuditLogRoot,
  AuditLogHeader,
  AuditLogTitle,
  AuditLogCount,
  AuditLogList,
  AuditLogRow,
  AuditLogSummary,
  AuditLogTime,
  AuditLogSource,
  AuditLogMetadata,
  AuditLogEmpty,
}
```

- [ ] **Step 6: Rewrite the wrapper to compose the parts**

Replace the whole body of `audit-log-viewer.tsx`:

```tsx
import * as React from "react"

import {
  AuditLogCount,
  AuditLogEmpty,
  AuditLogHeader,
  AuditLogList,
  AuditLogMetadata,
  AuditLogRoot,
  AuditLogRow,
  AuditLogSource,
  AuditLogSummary,
  AuditLogTime,
  AuditLogTitle,
} from "./audit-log-parts"

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target?: string
  timestamp: string
  metadata?: string
  /** Opaque, consumer-defined id of the system this entry came from. */
  source?: string
}

export interface AuditLogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: AuditLogEntry[]
  emptyMessage?: string
  onEntrySelect?: (entryId: string) => void
  /** Renders the label for an entry's `source`. Defaults to the raw id. */
  renderSource?: (source: string) => React.ReactNode
  /** Renders an entry's `metadata`. Defaults to the raw string. */
  renderMetadata?: (metadata: string) => React.ReactNode
}

const AuditLogViewerRoot = React.forwardRef<HTMLDivElement, AuditLogViewerProps>(
  (
    { className, entries, emptyMessage = "No audit entries", onEntrySelect, renderSource, renderMetadata, ...props },
    ref
  ) => (
    <AuditLogRoot ref={ref} className={className} onEntrySelect={onEntrySelect} {...props}>
      <AuditLogHeader>
        <AuditLogTitle>Audit Log</AuditLogTitle>
        <AuditLogCount>{entries.length} entries</AuditLogCount>
      </AuditLogHeader>

      {entries.length === 0 ? (
        <AuditLogEmpty>{emptyMessage}</AuditLogEmpty>
      ) : (
        <AuditLogList>
          {entries.map((entry) => (
            <AuditLogRow key={entry.id} entryId={entry.id}>
              <AuditLogSummary>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {entry.actor} {entry.action}
                    {entry.target ? ` ${entry.target}` : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    {entry.source ? (
                      <AuditLogSource>
                        {renderSource ? renderSource(entry.source) : entry.source}
                      </AuditLogSource>
                    ) : null}
                    <AuditLogTime>{entry.timestamp}</AuditLogTime>
                  </div>
                </div>
                {entry.metadata ? (
                  <AuditLogMetadata>
                    {renderMetadata ? renderMetadata(entry.metadata) : entry.metadata}
                  </AuditLogMetadata>
                ) : null}
              </AuditLogSummary>
            </AuditLogRow>
          ))}
        </AuditLogList>
      )}
    </AuditLogRoot>
  )
)
AuditLogViewerRoot.displayName = "AuditLogViewer"

/**
 * Data-driven audit log. Pass `entries` for the common case; import the
 * parts (also attached here as `AuditLogViewer.Row` etc.) to compose a
 * custom layout.
 */
const AuditLogViewer = Object.assign(AuditLogViewerRoot, {
  Root: AuditLogRoot,
  Header: AuditLogHeader,
  Title: AuditLogTitle,
  Count: AuditLogCount,
  List: AuditLogList,
  Row: AuditLogRow,
  Summary: AuditLogSummary,
  Time: AuditLogTime,
  Source: AuditLogSource,
  Metadata: AuditLogMetadata,
  Empty: AuditLogEmpty,
})

export { AuditLogViewer }
export * from "./audit-log-parts"
export * from "./audit-log-context"
```

Note: `AuditLogSummary` renders the metadata *inside* the summary element, matching today's markup where metadata sits inside the row `<button>`/`<div>`. Do not move it out — the existing `FormattedMetadata` story and the metadata tests depend on it.

- [ ] **Step 7: Update the folder barrel**

`index.ts`:

```ts
export { AuditLogViewer } from "./audit-log-viewer"
export type { AuditLogViewerProps, AuditLogEntry } from "./audit-log-viewer"
export * from "./audit-log-parts"
export * from "./audit-log-context"
```

- [ ] **Step 8: Run tests — all 12 must pass**

```bash
npx vitest run src/components/audit-log-viewer
```
Expected: PASS, `Tests 12 passed (12)`. The original nine are unmodified. If any of the original nine fails, the refactor changed behaviour — fix the parts, not the test.

- [ ] **Step 9: Type-check and lint**

```bash
npm run type-check && npm run lint
```
Expected: both clean.

- [ ] **Step 10: Commit**

```bash
git add packages/web/src/components/audit-log-viewer
git commit -m "refactor(web): split AuditLogViewer into composable parts"
```

---

### Task 2: Labels, pluralization, heading level, list labelling

Fixes defects 1, 4, 5.

**Files:**
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx`
- Test: `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (append)

**Interfaces:**
- Consumes: `AuditLogLabels`, `defaultAuditLogLabels`, `useAuditLogViewer` (Task 1).
- Produces: `AuditLogViewerProps.labels?: Partial<AuditLogLabels>`, `AuditLogViewerProps.headingLevel?: 2 | 3 | 4 | 5 | 6`; `AuditLogTitleProps.level?: 2 | 3 | 4 | 5 | 6`; `AuditLogRoot` supplies `headingId` through context as `AuditLogViewerContextValue.headingId: string`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe("AuditLogViewer labels and headings", () => {
  it("pluralizes the entry count", () => {
    const { rerender } = render(<AuditLogViewer entries={[]} />)
    expect(screen.getByText("0 entries")).toBeInTheDocument()

    rerender(<AuditLogViewer entries={entries} />)
    expect(screen.getByText("1 entry")).toBeInTheDocument()

    rerender(<AuditLogViewer entries={[entries[0], { ...entries[0], id: "2" }]} />)
    expect(screen.getByText("2 entries")).toBeInTheDocument()
  })

  it("renders an h3 heading by default", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.getByRole("heading", { level: 3, name: "Audit Log" })).toBeInTheDocument()
  })

  it("honours headingLevel", () => {
    render(<AuditLogViewer entries={entries} headingLevel={2} />)
    expect(screen.getByRole("heading", { level: 2, name: "Audit Log" })).toBeInTheDocument()
  })

  it("labels the entry list with the heading", () => {
    render(<AuditLogViewer entries={entries} />)
    const heading = screen.getByRole("heading", { name: "Audit Log" })
    expect(screen.getByRole("list")).toHaveAttribute("aria-labelledby", heading.id)
    expect(heading.id).toBeTruthy()
  })

  it("overrides every string via labels", () => {
    render(
      <AuditLogViewer
        entries={[]}
        labels={{
          title: "Journal d'audit",
          countLabel: (count) => `${count} entrée(s)`,
          empty: "Aucune entrée",
        }}
      />
    )
    expect(screen.getByRole("heading", { name: "Journal d'audit" })).toBeInTheDocument()
    expect(screen.getByText("0 entrée(s)")).toBeInTheDocument()
    expect(screen.getByText("Aucune entrée")).toBeInTheDocument()
  })

  it("prefers the legacy emptyMessage prop over labels.empty", () => {
    render(<AuditLogViewer entries={[]} emptyMessage="Nothing here" labels={{ empty: "ignored" }} />)
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
    expect(screen.queryByText("ignored")).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/components/audit-log-viewer
```
Expected: FAIL — "1 entries" found instead of "1 entry"; `aria-labelledby` missing; `labels` not a prop.

- [ ] **Step 3: Add `headingId` to the viewer context**

In `audit-log-context.tsx`, extend the interface:

```tsx
export interface AuditLogViewerContextValue {
  labels: AuditLogLabels
  onEntrySelect?: (entryId: string) => void
  /** Id of the viewer's heading, for `aria-labelledby` on the list. */
  headingId: string
}
```

- [ ] **Step 4: Generate and share the id in `AuditLogRoot`**

In `audit-log-parts.tsx`, inside `AuditLogRoot`:

```tsx
const reactId = React.useId()
const headingId = `${reactId}-heading`
const value = React.useMemo(
  () => ({ labels: mergedLabels, onEntrySelect, headingId }),
  [mergedLabels, onEntrySelect, headingId]
)
```

- [ ] **Step 5: Make `AuditLogTitle` levelled and self-identifying**

Replace `AuditLogTitle` in `audit-log-parts.tsx`:

```tsx
export interface AuditLogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level. Default 3 — set it to keep a consuming page's outline correct. */
  level?: 2 | 3 | 4 | 5 | 6
}

const AuditLogTitle = React.forwardRef<HTMLHeadingElement, AuditLogTitleProps>(
  ({ className, level = 3, children, ...props }, ref) => {
    const { labels, headingId } = useAuditLogViewer()
    const Heading = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6"

    return (
      <Heading ref={ref} id={headingId} className={cn("text-sm font-semibold", className)} {...props}>
        {children ?? labels.title}
      </Heading>
    )
  }
)
AuditLogTitle.displayName = "AuditLogTitle"
```

- [ ] **Step 6: Label the list**

Replace `AuditLogList` in `audit-log-parts.tsx`:

```tsx
const AuditLogList = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => {
    const { headingId } = useAuditLogViewer()
    return (
      <ol ref={ref} aria-labelledby={headingId} className={cn("space-y-2", className)} {...props} />
    )
  }
)
AuditLogList.displayName = "AuditLogList"
```

- [ ] **Step 7: Wire the new props through the wrapper**

In `audit-log-viewer.tsx`, add to `AuditLogViewerProps`:

```tsx
  /** Overrides for user-visible strings. Unspecified keys keep their English default. */
  labels?: Partial<AuditLogLabels>
  /** Heading level for the viewer title. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
```

Import `type AuditLogLabels` from `./audit-log-context`. Destructure `labels` and `headingLevel = 3`, then:

```tsx
<AuditLogRoot ref={ref} className={className} onEntrySelect={onEntrySelect} labels={labels} {...props}>
  <AuditLogHeader>
    <AuditLogTitle level={headingLevel} />
    <AuditLogCount>{mergedCountLabel(entries.length)}</AuditLogCount>
  </AuditLogHeader>
```

`AuditLogCount` needs the merged label, but the wrapper sits *outside* the provider it creates. Resolve it locally rather than reaching into context:

```tsx
const mergedCountLabel = labels?.countLabel ?? defaultAuditLogLabels.countLabel
```

Import `defaultAuditLogLabels` alongside the type. Change the empty branch to `<AuditLogEmpty>{emptyMessage}</AuditLogEmpty>` where `emptyMessage` now defaults to `undefined` instead of `"No audit entries"`, so `AuditLogEmpty` falls through to `labels.empty`:

```tsx
{ className, entries, emptyMessage, onEntrySelect, /* … */ }
```

The legacy default string now lives in `defaultAuditLogLabels.empty`, so behaviour is unchanged when neither is passed.

- [ ] **Step 8: Run tests**

```bash
npx vitest run src/components/audit-log-viewer
```
Expected: PASS, 18 passed. Original nine still unmodified and green.

- [ ] **Step 9: Type-check, lint, commit**

```bash
npm run type-check && npm run lint
git add packages/web/src/components/audit-log-viewer
git commit -m "fix(web): pluralize AuditLogViewer count and localize its labels"
```

---

### Task 3: Machine-readable time, summary slot, metadata overflow

Fixes defects 2, 6, 7.

**Files:**
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx`
- Test: `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (append)

**Interfaces:**
- Consumes: parts from Task 1.
- Produces: `AuditLogEntry.dateTime?: string`; `AuditLogViewerProps.renderSummary?: (entry: AuditLogEntry) => React.ReactNode`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe("AuditLogViewer time and summary", () => {
  it("sets dateTime on the time element when supplied", () => {
    render(
      <AuditLogViewer
        entries={[{ ...entries[0], timestamp: "24 Feb 2026", dateTime: "2026-02-24T09:12:00Z" }]}
      />
    )
    const time = screen.getByText("24 Feb 2026")
    expect(time.tagName).toBe("TIME")
    expect(time).toHaveAttribute("datetime", "2026-02-24T09:12:00Z")
  })

  it("omits the dateTime attribute entirely when not supplied", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.getByText("2026-02-24")).not.toHaveAttribute("datetime")
  })

  it("renders a custom summary via renderSummary", () => {
    render(
      <AuditLogViewer
        entries={entries}
        renderSummary={(entry) => <span data-testid="summary">{entry.action.toUpperCase()}</span>}
      />
    )
    expect(screen.getByTestId("summary")).toHaveTextContent("UPDATED")
    expect(screen.queryByText(/mahesh updated settings/i)).not.toBeInTheDocument()
  })

  it("wraps long metadata instead of overflowing", () => {
    render(<AuditLogViewer entries={[{ ...entries[0], metadata: "x".repeat(400) }]} />)
    expect(screen.getByText("x".repeat(400))).toHaveClass("break-words")
  })
})
```

- [ ] **Step 2: Run to verify failure**

Expected: FAIL — `datetime` attribute absent; `renderSummary` not a prop; no `break-words` class.

- [ ] **Step 3: Add `break-words` to `AuditLogMetadata`**

In `audit-log-parts.tsx`:

```tsx
const AuditLogMetadata = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-1 break-words text-xs text-muted-foreground", className)} {...props} />
  )
)
```

- [ ] **Step 4: Extend the entry type and wire both props**

In `audit-log-viewer.tsx`, add to `AuditLogEntry`:

```tsx
  /**
   * ISO 8601 form of `timestamp`, for `<time dateTime>`. Omit it and no
   * attribute is emitted — an invalid `dateTime` is worse than none.
   */
  dateTime?: string
```

Add to `AuditLogViewerProps`:

```tsx
  /**
   * Renders the entry's headline. Use it to localize word order, which
   * string substitution cannot do.
   */
  renderSummary?: (entry: AuditLogEntry) => React.ReactNode
```

In the row body, replace the `<p>` headline and the `AuditLogTime` call:

```tsx
<p className="text-sm font-medium">
  {renderSummary
    ? renderSummary(entry)
    : `${entry.actor} ${entry.action}${entry.target ? ` ${entry.target}` : ""}`}
</p>
```

```tsx
<AuditLogTime dateTime={entry.dateTime}>{entry.timestamp}</AuditLogTime>
```

React omits the attribute when the value is `undefined`, which is exactly the required behaviour — do not substitute `""`.

- [ ] **Step 5: Run tests**

Expected: PASS, 22 passed.

- [ ] **Step 6: Type-check, lint, commit**

```bash
npm run type-check && npm run lint
git add packages/web/src/components/audit-log-viewer
git commit -m "fix(web): give AuditLogViewer rows machine-readable times and a summary slot"
```

---

### Task 4: Focus ring and selection state

Fixes defect 3, adds selection.

**Files:**
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-context.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx`
- Test: `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (append)

**Interfaces:**
- Consumes: context + parts from Tasks 1–2.
- Produces: `AuditLogViewerContextValue.selectedEntryId?: string`; `AuditLogRootProps.selectedEntryId?: string`; `AuditLogViewerProps.selectedEntryId?: string`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe("AuditLogViewer focus and selection", () => {
  it("gives a selectable row a visible focus ring", () => {
    render(<AuditLogViewer entries={entries} onEntrySelect={vi.fn()} />)
    expect(screen.getByRole("button")).toHaveClass("focus-visible:ring-2")
  })

  it("marks the selected entry with aria-current", () => {
    render(<AuditLogViewer entries={entries} onEntrySelect={vi.fn()} selectedEntryId="1" />)
    expect(screen.getByRole("button")).toHaveAttribute("aria-current", "true")
  })

  it("leaves unselected entries without aria-current", () => {
    render(<AuditLogViewer entries={entries} onEntrySelect={vi.fn()} selectedEntryId="other" />)
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-current")
  })
})
```

- [ ] **Step 2: Run to verify failure**

Expected: FAIL — no `focus-visible:ring-2` class; `selectedEntryId` not a prop.

- [ ] **Step 3: Add `selectedEntryId` to context**

In `audit-log-context.tsx`, add to `AuditLogViewerContextValue`:

```tsx
  /** Id of the currently selected entry, if the surface tracks selection. */
  selectedEntryId?: string
```

- [ ] **Step 4: Accept and provide it in `AuditLogRoot`**

Add `selectedEntryId` to `AuditLogRootProps`, destructure it, and include it in the memoized value alongside `labels`, `onEntrySelect`, and `headingId` (add it to the dependency array).

- [ ] **Step 5: Apply ring and selected styling in `AuditLogSummary`**

Replace the `<button>` branch's className, and add the aria attribute:

```tsx
const { onEntrySelect, selectedEntryId } = useAuditLogViewer()
const { entryId, summaryId } = useAuditLogRow()
const selected = selectedEntryId === entryId
```

```tsx
<button
  ref={ref as React.Ref<HTMLButtonElement>}
  id={summaryId}
  type="button"
  aria-current={selected ? "true" : undefined}
  className={cn(
    AUDIT_LOG_ROW_CLASSNAME,
    "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    selected && "border-primary bg-accent",
    className
  )}
  onClick={() => onEntrySelect(entryId)}
  {...props}
>
```

- [ ] **Step 6: Pass the prop through the wrapper**

Add to `AuditLogViewerProps`:

```tsx
  /** Id of the selected entry. Marks that row `aria-current` and tints it. */
  selectedEntryId?: string
```

Destructure it and forward it to `AuditLogRoot`.

- [ ] **Step 7: Run tests**

Expected: PASS, 25 passed.

- [ ] **Step 8: Type-check, lint, commit**

```bash
npm run type-check && npm run lint
git add packages/web/src/components/audit-log-viewer
git commit -m "fix(web): add focus ring and selected state to AuditLogViewer rows"
```

---

### Task 5: Expand/collapse disclosure

The core of the request. Adds the `@tesserix/icons` dependency.

**Files:**
- Modify: `packages/web/package.json`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-context.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx`
- Test: `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (append)

**Interfaces:**
- Consumes: everything from Tasks 1–4.
- Produces: `useAuditLogExpansion`; `AuditLogRowContextValue` gains `detailId: string`, `expanded: boolean`, `hasDetail: boolean`, `registerDetail: (hasDetail: boolean) => void`, `toggle: () => void`, `entryLabel?: string`; parts `AuditLogDisclosure`, `AuditLogDetail`; `AuditLogRootProps` and `AuditLogViewerProps` gain `expandedIds?: string[]`, `defaultExpandedIds?: string[]`, `onExpandedChange?: (expandedIds: string[]) => void`; `AuditLogEntry.detail?: React.ReactNode`; `AuditLogViewerProps.renderDetail?: (entry: AuditLogEntry) => React.ReactNode`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe("AuditLogViewer disclosure", () => {
  const withDetail = [{ ...entries[0], detail: "Full event payload" }]

  it("renders no disclosure for an entry without detail", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.queryByRole("button", { name: /show details/i })).not.toBeInTheDocument()
  })

  it("renders a collapsed disclosure for an entry with detail", () => {
    render(<AuditLogViewer entries={withDetail} />)
    const toggle = screen.getByRole("button", { name: /show details/i })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Full event payload")).not.toBeInTheDocument()
  })

  it("expands and collapses on click", () => {
    render(<AuditLogViewer entries={withDetail} />)
    const toggle = screen.getByRole("button", { name: /show details/i })

    fireEvent.click(toggle)
    expect(screen.getByText("Full event payload")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /hide details/i })).toHaveAttribute("aria-expanded", "true")

    fireEvent.click(screen.getByRole("button", { name: /hide details/i }))
    expect(screen.queryByText("Full event payload")).not.toBeInTheDocument()
  })

  it("points the disclosure at the detail region it controls", () => {
    render(<AuditLogViewer entries={withDetail} defaultExpandedIds={["1"]} />)
    const toggle = screen.getByRole("button", { name: /hide details/i })
    const region = screen.getByRole("region")
    expect(toggle).toHaveAttribute("aria-controls", region.id)
    expect(region.id).toBeTruthy()
  })

  it("names the disclosure after its entry", () => {
    render(<AuditLogViewer entries={withDetail} />)
    expect(
      screen.getByRole("button", { name: /show details.*mahesh updated settings/i })
    ).toBeInTheDocument()
  })

  it("honours defaultExpandedIds", () => {
    render(<AuditLogViewer entries={withDetail} defaultExpandedIds={["1"]} />)
    expect(screen.getByText("Full event payload")).toBeInTheDocument()
  })

  it("supports controlled expansion", () => {
    const onExpandedChange = vi.fn()
    render(
      <AuditLogViewer entries={withDetail} expandedIds={[]} onExpandedChange={onExpandedChange} />
    )

    fireEvent.click(screen.getByRole("button", { name: /show details/i }))
    expect(onExpandedChange).toHaveBeenCalledWith(["1"])
    // Controlled: stays collapsed until the parent says otherwise.
    expect(screen.queryByText("Full event payload")).not.toBeInTheDocument()
  })

  it("builds detail from renderDetail when the entry has none", () => {
    render(
      <AuditLogViewer
        entries={entries}
        renderDetail={(entry) => <span>payload for {entry.id}</span>}
        defaultExpandedIds={["1"]}
      />
    )
    expect(screen.getByText(/payload for 1/)).toBeInTheDocument()
  })

  it("never nests the disclosure inside the selectable summary", () => {
    render(<AuditLogViewer entries={withDetail} onEntrySelect={vi.fn()} />)
    const summary = screen.getByRole("button", { name: /mahesh updated settings/i })
    expect(summary.querySelector("button")).toBeNull()
    expect(screen.getByRole("button", { name: /show details/i })).toBeInTheDocument()
  })

  it("keeps selection and disclosure independent", () => {
    const onEntrySelect = vi.fn()
    render(<AuditLogViewer entries={withDetail} onEntrySelect={onEntrySelect} />)

    fireEvent.click(screen.getByRole("button", { name: /show details/i }))
    expect(onEntrySelect).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button", { name: /mahesh updated settings/i }))
    expect(onEntrySelect).toHaveBeenCalledWith("1")
  })
})
```

- [ ] **Step 2: Run to verify failure**

Expected: FAIL — no disclosure button exists.

- [ ] **Step 3: Add the icons dependency**

In `packages/web/package.json`, add to `dependencies` (keep keys alphabetical):

```json
    "@tesserix/icons": "workspace:*",
```

and to `peerDependencies`:

```json
    "lucide-react": "^0.469.0",
```

Then from the repo root:

```bash
pnpm install
pnpm --filter @tesserix/icons build
```

Verify the subpath resolves before writing component code:

```bash
node -e "console.log(require.resolve('@tesserix/icons/web', { paths: ['packages/web'] }))"
```
Expected: a path under `packages/icons/dist/`. If this fails, STOP and report — do not fall back to an inline SVG without checking in.

- [ ] **Step 4: Add the expansion hook**

Append to `audit-log-context.tsx`:

```tsx
export interface UseAuditLogExpansionOptions {
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  onExpandedChange?: (expandedIds: string[]) => void
}

export interface AuditLogExpansion {
  expandedIds: ReadonlySet<string>
  toggleEntry: (entryId: string) => void
}

/**
 * Multiple-open expansion state. Controlled when `expandedIds` is passed;
 * otherwise self-managed from `defaultExpandedIds`.
 */
export function useAuditLogExpansion({
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
}: UseAuditLogExpansionOptions): AuditLogExpansion {
  const [uncontrolled, setUncontrolled] = React.useState<ReadonlySet<string>>(
    () => new Set(defaultExpandedIds ?? [])
  )
  const isControlled = expandedIds !== undefined
  const controlled = React.useMemo(() => new Set(expandedIds ?? []), [expandedIds])
  const current = isControlled ? controlled : uncontrolled

  const toggleEntry = React.useCallback(
    (entryId: string) => {
      const next = new Set(current)
      if (next.has(entryId)) {
        next.delete(entryId)
      } else {
        next.add(entryId)
      }

      if (!isControlled) {
        setUncontrolled(next)
      }
      onExpandedChange?.(Array.from(next))
    },
    [current, isControlled, onExpandedChange]
  )

  return { expandedIds: current, toggleEntry }
}
```

Extend `AuditLogRowContextValue`:

```tsx
export interface AuditLogRowContextValue {
  entryId: string
  summaryId: string
  detailId: string
  expanded: boolean
  toggle: () => void
  /** True once an `AuditLogDetail` has registered for this row. */
  hasDetail: boolean
  registerDetail: (hasDetail: boolean) => void
  /** Plain-text name of the row, for the disclosure's accessible name. */
  entryLabel?: string
}
```

Extend `AuditLogViewerContextValue`:

```tsx
  expandedIds: ReadonlySet<string>
  toggleEntry: (entryId: string) => void
```

- [ ] **Step 5: Wire expansion into `AuditLogRoot` and `AuditLogRow`**

In `audit-log-parts.tsx`, `AuditLogRoot` gains the expansion options in its props and calls the hook:

```tsx
export interface AuditLogRootProps extends React.HTMLAttributes<HTMLDivElement> {
  labels?: Partial<AuditLogLabels>
  onEntrySelect?: (entryId: string) => void
  selectedEntryId?: string
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  onExpandedChange?: (expandedIds: string[]) => void
}
```

```tsx
const { expandedIds: expanded, toggleEntry } = useAuditLogExpansion({
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
})
const value = React.useMemo(
  () => ({ labels: mergedLabels, onEntrySelect, selectedEntryId, headingId, expandedIds: expanded, toggleEntry }),
  [mergedLabels, onEntrySelect, selectedEntryId, headingId, expanded, toggleEntry]
)
```

`AuditLogRow` gains an `entryLabel` prop and the row-level detail registration:

```tsx
export interface AuditLogRowProps extends React.LiHTMLAttributes<HTMLLIElement> {
  entryId: string
  /** Plain-text row name, used to name the disclosure button. */
  entryLabel?: string
}

const AuditLogRow = React.forwardRef<HTMLLIElement, AuditLogRowProps>(
  ({ className, entryId, entryLabel, children, ...props }, ref) => {
    const reactId = React.useId()
    const { expandedIds, toggleEntry } = useAuditLogViewer()
    const [hasDetail, setHasDetail] = React.useState(false)

    const registerDetail = React.useCallback((next: boolean) => setHasDetail(next), [])
    const toggle = React.useCallback(() => toggleEntry(entryId), [toggleEntry, entryId])

    const value = React.useMemo(
      () => ({
        entryId,
        summaryId: `${reactId}-summary`,
        detailId: `${reactId}-detail`,
        expanded: expandedIds.has(entryId),
        toggle,
        hasDetail,
        registerDetail,
        entryLabel,
      }),
      [entryId, reactId, expandedIds, toggle, hasDetail, registerDetail, entryLabel]
    )

    return (
      <AuditLogRowProvider value={value}>
        <li ref={ref} className={className} {...props}>
          {children}
        </li>
      </AuditLogRowProvider>
    )
  }
)
```

- [ ] **Step 6: Add the disclosure and detail parts**

Append to `audit-log-parts.tsx`, and add `import { ChevronDown } from "@tesserix/icons/web"` at the top:

```tsx
export interface AuditLogDisclosureProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-expanded" | "aria-controls"> {}

/**
 * Toggles the row's detail. A SIBLING of `AuditLogSummary`, never a child —
 * HTML forbids a button inside a button, and the summary is itself a button
 * whenever the viewer tracks selection.
 */
const AuditLogDisclosure = React.forwardRef<HTMLButtonElement, AuditLogDisclosureProps>(
  ({ className, ...props }, ref) => {
    const { labels } = useAuditLogViewer()
    const { detailId, expanded, toggle, entryLabel } = useAuditLogRow()
    const action = expanded ? labels.collapse : labels.expand

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={expanded}
        aria-controls={detailId}
        aria-label={entryLabel ? `${action}: ${entryLabel}` : action}
        onClick={toggle}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>
    )
  }
)
AuditLogDisclosure.displayName = "AuditLogDisclosure"

/**
 * The row's collapsible detail. Unmounts when collapsed, so hidden content
 * stays out of the accessibility tree entirely.
 */
const AuditLogDetail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { detailId, summaryId, expanded, registerDetail } = useAuditLogRow()

    React.useEffect(() => {
      registerDetail(true)
      return () => registerDetail(false)
    }, [registerDetail])

    if (!expanded) {
      return null
    }

    return (
      <div
        ref={ref}
        id={detailId}
        role="region"
        aria-labelledby={summaryId}
        className={cn("mt-2 break-words rounded-md border bg-muted/40 p-3 text-xs", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AuditLogDetail.displayName = "AuditLogDetail"
```

Add both to the module's export block.

- [ ] **Step 7: Compose the row in the wrapper**

In `audit-log-viewer.tsx`, add to `AuditLogEntry`:

```tsx
  /** Collapsible detail for this entry. Renders a disclosure when present. */
  detail?: React.ReactNode
```

Add to `AuditLogViewerProps`:

```tsx
  /** Builds collapsible detail for entries that carry none of their own. */
  renderDetail?: (entry: AuditLogEntry) => React.ReactNode
  /** Expanded entry ids (controlled). */
  expandedIds?: string[]
  /** Initially expanded entry ids (uncontrolled). */
  defaultExpandedIds?: string[]
  onExpandedChange?: (expandedIds: string[]) => void
```

Forward `expandedIds`, `defaultExpandedIds`, `onExpandedChange`, and `selectedEntryId` to `AuditLogRoot`. Restructure the row so summary and disclosure are siblings:

```tsx
{entries.map((entry) => {
  const detail = entry.detail ?? renderDetail?.(entry)
  const entryLabel = `${entry.actor} ${entry.action}${entry.target ? ` ${entry.target}` : ""}`

  return (
    <AuditLogRow
      key={entry.id}
      entryId={entry.id}
      entryLabel={entryLabel}
    >
      <div className="flex items-start gap-2">
        <AuditLogSummary className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {renderSummary ? renderSummary(entry) : entryLabel}
            </p>
            <div className="flex items-center gap-2">
              {entry.source ? (
                <AuditLogSource>
                  {renderSource ? renderSource(entry.source) : entry.source}
                </AuditLogSource>
              ) : null}
              <AuditLogTime dateTime={entry.dateTime}>{entry.timestamp}</AuditLogTime>
            </div>
          </div>
          {entry.metadata ? (
            <AuditLogMetadata>
              {renderMetadata ? renderMetadata(entry.metadata) : entry.metadata}
            </AuditLogMetadata>
          ) : null}
        </AuditLogSummary>
        {detail ? <AuditLogDisclosure /> : null}
      </div>
      {detail ? <AuditLogDetail>{detail}</AuditLogDetail> : null}
    </AuditLogRow>
  )
})}
```

Two things to note. `entryLabel` now serves double duty — it is both the default headline text and the disclosure's accessible-name suffix, which replaces the inline template expression Task 3 put in the `<p>`. And the summary's inner markup is otherwise unchanged from Task 3; only the wrapping `<div className="flex items-start gap-2">` and the two new siblings are added.

Add `Disclosure: AuditLogDisclosure` and `Detail: AuditLogDetail` to the `Object.assign` alias map.

- [ ] **Step 8: Run tests**

```bash
npx vitest run src/components/audit-log-viewer
```
Expected: PASS, 35 passed. In particular the original nine and the "renders rows as buttons only when onEntrySelect is provided" case must still pass — the disclosure must not introduce a button for detail-less entries.

- [ ] **Step 9: Type-check, lint, commit**

```bash
npm run type-check && npm run lint
git add packages/web/package.json packages/web/src/components/audit-log-viewer pnpm-lock.yaml
git commit -m "feat(web): add per-entry expand/collapse to AuditLogViewer"
```

---

### Task 6: Severity

**Files:**
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-context.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx`
- Test: `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (append)

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: `AuditLogSeverity = "info" | "warning" | "critical"`; `AuditLogLabels.severityLabel: (severity: AuditLogSeverity) => string`; `AuditLogRowProps.severity?: AuditLogSeverity`; `AuditLogEntry.severity?: AuditLogSeverity`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe("AuditLogViewer severity", () => {
  it("tints a critical row and names the severity in text", () => {
    render(<AuditLogViewer entries={[{ ...entries[0], severity: "critical" }]} />)
    expect(screen.getByRole("listitem")).toHaveClass("border-l-destructive")
    expect(screen.getByText("Critical")).toHaveClass("sr-only")
  })

  it("tints a warning row", () => {
    render(<AuditLogViewer entries={[{ ...entries[0], severity: "warning" }]} />)
    expect(screen.getByRole("listitem")).toHaveClass("border-l-warning")
  })

  it("adds no severity affordance when the entry has none", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.getByRole("listitem").className).not.toMatch(/border-l-/)
  })

  it("localizes the severity word", () => {
    render(
      <AuditLogViewer
        entries={[{ ...entries[0], severity: "critical" }]}
        labels={{ severityLabel: () => "Critique" }}
      />
    )
    expect(screen.getByText("Critique")).toHaveClass("sr-only")
  })
})
```

- [ ] **Step 2: Run to verify failure**

Expected: FAIL — no `border-l-*` class, no severity text.

- [ ] **Step 3: Add the type and label default**

In `audit-log-context.tsx`:

```tsx
export type AuditLogSeverity = "info" | "warning" | "critical"
```

Add to `AuditLogLabels`:

```tsx
  severityLabel: (severity: AuditLogSeverity) => string
```

Add to `defaultAuditLogLabels`:

```tsx
  severityLabel: (severity) =>
    ({ info: "Info", warning: "Warning", critical: "Critical" })[severity],
```

- [ ] **Step 4: Render severity in `AuditLogRow`**

In `audit-log-parts.tsx`, add `severity?: AuditLogSeverity` to `AuditLogRowProps`, then:

```tsx
const SEVERITY_CLASSNAMES: Record<AuditLogSeverity, string> = {
  info: "border-l-4 border-l-primary pl-1",
  warning: "border-l-4 border-l-warning pl-1",
  critical: "border-l-4 border-l-destructive pl-1",
}
```

In the `<li>`:

```tsx
<li ref={ref} className={cn(severity && SEVERITY_CLASSNAMES[severity], className)} {...props}>
  {severity ? <span className="sr-only">{labels.severityLabel(severity)}</span> : null}
  {children}
</li>
```

`AuditLogRow` already calls `useAuditLogViewer()` for `expandedIds`; destructure `labels` from that same call rather than adding a second one.

- [ ] **Step 5: Pass it through the wrapper**

Add `severity?: AuditLogSeverity` to `AuditLogEntry` with a JSDoc line, and pass `severity={entry.severity}` to `AuditLogRow`. Re-export the type from `audit-log-viewer.tsx` (the `export * from "./audit-log-context"` already covers it).

- [ ] **Step 6: Run tests**

Expected: PASS, 39 passed.

- [ ] **Step 7: Type-check, lint, commit**

```bash
npm run type-check && npm run lint
git add packages/web/src/components/audit-log-viewer
git commit -m "feat(web): add severity affordance to AuditLogViewer rows"
```

---

### Task 7: Loading state

**Files:**
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-parts.tsx`
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.tsx`
- Test: `packages/web/src/components/audit-log-viewer/audit-log-viewer.test.tsx` (append)

**Interfaces:**
- Consumes: Tasks 1–6, plus `Skeleton` from `../skeleton`.
- Produces: `AuditLogSkeleton` (props: `rows?: number`); `AuditLogViewerProps.loading?: boolean`, `AuditLogViewerProps.loadingRowCount?: number`.

- [ ] **Step 1: Write the failing tests**

```tsx
describe("AuditLogViewer loading", () => {
  it("renders skeleton rows while loading", () => {
    render(<AuditLogViewer entries={[]} loading />)
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true")
    expect(screen.queryByText("No audit entries")).not.toBeInTheDocument()
  })

  it("honours loadingRowCount", () => {
    render(<AuditLogViewer entries={[]} loading loadingRowCount={5} />)
    expect(screen.getByRole("status").querySelectorAll("[data-slot='audit-log-skeleton-row']")).toHaveLength(5)
  })

  it("prefers entries over the loading state once loaded", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(screen.getByText(/mahesh updated settings/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Expected: FAIL — `loading` not a prop, no `status` role.

- [ ] **Step 3: Add the skeleton part**

In `audit-log-parts.tsx`, add `import { Skeleton } from "../skeleton"`:

```tsx
export interface AuditLogSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Placeholder rows to render. Default 3. */
  rows?: number
}

/** Placeholder rows for a viewer whose entries have not arrived yet. */
const AuditLogSkeleton = React.forwardRef<HTMLDivElement, AuditLogSkeletonProps>(
  ({ className, rows = 3, ...props }, ref) => (
    <div ref={ref} role="status" aria-busy="true" className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          data-slot="audit-log-skeleton-row"
          className={cn(AUDIT_LOG_ROW_CLASSNAME, "space-y-2")}
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  )
)
AuditLogSkeleton.displayName = "AuditLogSkeleton"
```

Add it to the export block.

- [ ] **Step 4: Branch in the wrapper**

Add to `AuditLogViewerProps`:

```tsx
  /** Renders placeholder rows instead of entries or the empty state. */
  loading?: boolean
  /** Placeholder rows while `loading`. Default 3. */
  loadingRowCount?: number
```

The body becomes a three-way branch — loading wins over empty, because an empty list and an unloaded list mean different things to an operator:

```tsx
{loading ? (
  <AuditLogSkeleton rows={loadingRowCount} />
) : entries.length === 0 ? (
  <AuditLogEmpty>{emptyMessage}</AuditLogEmpty>
) : (
  <AuditLogList>
    {entries.map((entry) => {
      // …the entire `entries.map` body from Task 5 Step 7, unchanged.
      // Only the surrounding ternary gains the `loading` branch above;
      // do not retype or alter the row markup.
    })}
  </AuditLogList>
)}
```

Keep the count in the header showing `entries.length` while loading — it reads `0 entries` until data lands, which is honest. Add `Skeleton: AuditLogSkeleton` to the alias map.

- [ ] **Step 5: Run tests**

Expected: PASS, 42 passed.

- [ ] **Step 6: Type-check, lint, commit**

```bash
npm run type-check && npm run lint
git add packages/web/src/components/audit-log-viewer
git commit -m "feat(web): add loading state to AuditLogViewer"
```

---

### Task 8: Stories, changeset, and the full gate

**Files:**
- Modify: `packages/web/src/components/audit-log-viewer/audit-log-viewer.stories.tsx` (append only)
- Create: `.changeset/audit-log-viewer-redesign.md`

**Interfaces:**
- Consumes: everything from Tasks 1–7.
- Produces: no new API.

- [ ] **Step 1: Append the new stories**

Do not modify the six existing stories. Append:

```tsx
export const Expandable: Story = {
  args: {
    entries: [
      {
        id: "1",
        actor: "Mahesh",
        action: "updated",
        target: "billing settings",
        timestamp: "2026-02-24 09:12 UTC",
        dateTime: "2026-02-24T09:12:00Z",
        metadata: "Changed payout schedule",
        detail: "before: monthly · after: weekly",
      },
      {
        id: "2",
        actor: "System",
        action: "rotated",
        target: "API key",
        timestamp: "2026-02-24 11:30 UTC",
        dateTime: "2026-02-24T11:30:00Z",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: /show details/i })
    await expect(toggle).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(toggle)
    await expect(canvas.getByText(/before: monthly/)).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: /hide details/i }))
    await expect(canvas.queryByText(/before: monthly/)).not.toBeInTheDocument()
  },
}

export const Selected: Story = {
  args: { onEntrySelect: fn(), selectedEntryId: "1" },
}

export const Loading: Story = {
  args: { entries: [], loading: true },
}

export const Severity: Story = {
  args: {
    entries: [
      { id: "1", actor: "System", action: "failed to rotate", target: "API key", timestamp: "09:07 UTC", severity: "critical" },
      { id: "2", actor: "jane@acme", action: "retried", target: "payout", timestamp: "09:09 UTC", severity: "warning" },
      { id: "3", actor: "operator@tesserix", action: "granted access to", target: "acme", timestamp: "09:11 UTC", severity: "info" },
    ],
  },
}

export const Composed: Story = {
  render: () => (
    <AuditLogViewer.Root>
      <AuditLogViewer.Header>
        <AuditLogViewer.Title level={2} />
        <AuditLogViewer.Count>2 entries</AuditLogViewer.Count>
      </AuditLogViewer.Header>
      <AuditLogViewer.List>
        <AuditLogViewer.Row entryId="1" entryLabel="Mahesh updated billing settings" severity="warning">
          <div className="flex items-start gap-2">
            <AuditLogViewer.Summary className="flex-1">
              <p className="text-sm font-medium">Mahesh updated billing settings</p>
              <AuditLogViewer.Time dateTime="2026-02-24T09:12:00Z">09:12 UTC</AuditLogViewer.Time>
            </AuditLogViewer.Summary>
            <AuditLogViewer.Disclosure />
          </div>
          <AuditLogViewer.Detail>before: monthly · after: weekly</AuditLogViewer.Detail>
        </AuditLogViewer.Row>
      </AuditLogViewer.List>
    </AuditLogViewer.Root>
  ),
}
```

`Composed` uses `render`, so it needs no `args`; if the `satisfies Meta` type complains about the missing required `entries`, give it `args: { entries: [] }` — the render function ignores them.

- [ ] **Step 2: Run the story interaction tests**

From the repo root:

```bash
pnpm --filter @tesserix/web test:run
```
Expected: PASS, 42 tests. Then confirm Storybook compiles the new stories:

```bash
pnpm --filter @tesserix/web build-storybook
```
Expected: completes without a build error. If `build-storybook` is not a script on that package, run the storybook app's build instead: `pnpm --filter @tesserix/storybook build-storybook`.

- [ ] **Step 3: Write the changeset**

Create `.changeset/audit-log-viewer-redesign.md`:

```markdown
---
"@tesserix/web": minor
---

AuditLogViewer: per-entry expand/collapse, composable parts, and accessibility fixes.

- Rows can now carry collapsible `detail` (or supply it via `renderDetail`), revealed by a disclosure button that is a sibling of the row summary rather than nested inside it.
- The component is now composable: `AuditLogRoot`, `AuditLogRow`, `AuditLogSummary`, `AuditLogDisclosure`, `AuditLogDetail` and friends are exported, and also attached as `AuditLogViewer.Row` etc. The `entries` prop remains the default path and is unchanged.
- New optional props: `labels`, `headingLevel`, `selectedEntryId`, `expandedIds`, `defaultExpandedIds`, `onExpandedChange`, `loading`, `loadingRowCount`, `renderSummary`, `renderDetail`.
- New optional `AuditLogEntry` fields: `dateTime`, `detail`, `severity`.
- Fixes: the entry count now pluralizes ("1 entry", not "1 entries"); `<time>` carries `dateTime` when supplied; selectable rows have a visible focus ring; the title's heading level is configurable and labels the entry list via `aria-labelledby`; long metadata wraps instead of overflowing.

`@tesserix/web` now requires `lucide-react` as a peer dependency (via `@tesserix/icons`).
```

- [ ] **Step 4: Run the full readiness gate**

From `packages/web/`:

```bash
npm run readiness:gate
```
This runs type-check, lint, tests, build, and the bundle-size check. Expected: all pass.

If `check:bundle-size` fails, the dot-notation aliases are the likely cause (they hold references to all 14 parts from one object — the known tradeoff recorded in the spec's risk table). Report the numbers rather than silently deleting the aliases.

- [ ] **Step 5: Verify the console consumer still type-checks against the new build**

The console is a separate repo consuming the published package, so a local check is best-effort. Confirm the component's own public surface did not drop anything it uses:

```bash
grep -n "renderSource\|renderMetadata\|emptyMessage\|entries" packages/web/dist/components/audit-log-viewer/audit-log-viewer.d.ts
```
Expected: all four still present on `AuditLogViewerProps`.

- [ ] **Step 6: Commit**

```bash
git add packages/web/src/components/audit-log-viewer .changeset/audit-log-viewer-redesign.md
git commit -m "test(web): add AuditLogViewer stories and release changeset"
```

---

## Verification Summary

At the end of Task 8, all of the following must hold:

1. `npx vitest run src/components/audit-log-viewer` → 42 passing, including the original nine **unmodified**.
2. `npm run readiness:gate` → clean.
3. The six pre-existing stories render unchanged; five new ones added.
4. `AuditLogViewerProps` still accepts `entries`, `emptyMessage`, `renderSource`, `renderMetadata`, `onEntrySelect` with their original meanings.
5. A row with no `detail` renders no disclosure button; a viewer with no `onEntrySelect` renders no focusable summary.
6. No nested interactive elements anywhere in a row.
7. `metadata` renders inline, never inside the collapsed detail.
8. A changeset marks this `minor`.
