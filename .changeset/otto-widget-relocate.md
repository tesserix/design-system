---
"@tesserix/otto-widget": minor
---

Relocate @tesserix/otto-widget into the design-system monorepo so it
shares the existing changesets + NPM_TOKEN publish pipeline with
@tesserix/web. Behaviour is unchanged for consumers — package name,
version, exports and peer dependencies all stay the same.

Previously the widget lived at slm-support-platform/packages/otto-widget
with its own publish-otto-widget.yml workflow gated on a different
secret. Folding it into design-system means:

- one place to bump shared-UI packages
- one publish pipeline (changesets -> GitHub Packages, optional manual
  npm publish for public mirror)
- changesets is the source of truth for version bumps so the next
  consumer (tesserix-home) can finally `npm install @tesserix/otto-widget`
  the same way it installs @tesserix/web
