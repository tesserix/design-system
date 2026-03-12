---
"@tesserix/web": patch
---

fix: add Tailwind v4 source registration for component class detection

Tailwind v4 excludes node_modules from content scanning by default, causing component styles (e.g., sidebar) to be missing in consuming apps. Added `tailwind-source.css` export so apps can use `@import "@tesserix/web/tailwind-source"` to register component files.
