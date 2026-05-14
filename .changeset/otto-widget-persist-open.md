---
"@tesserix/otto-widget": patch
---

Persist the widget's open/closed state across page refreshes.

Before: an accidental F5 mid-conversation collapsed the widget back
to the launcher pill, forcing the customer to click it again to
re-expand the (still-resumable) chat. After: the open/closed state
is saved to `sessionStorage` under a tenant-scoped key, so refresh
keeps the panel in the same state the customer left it.

Deliberately uses `sessionStorage` rather than `localStorage` — the
intent is "survive a refresh in this tab," not "remember a preference
forever." A fresh browser session the next day still starts with the
widget collapsed, which is the expected default.

No prop or API change. SSR-safe (lazy reads behind `typeof window`).
Failures from private-browsing / quota errors are swallowed silently;
worst case the widget reverts to its previous behaviour for that
session.
