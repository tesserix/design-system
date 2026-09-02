---
"@tesserix/icons": minor
"@tesserix/web": patch
---

Support lucide-react 1.x.

`@tesserix/icons` re-exported `Github` by name from `lucide-react`/`lucide-react-native`. lucide dropped its brand marks in 1.0, so on lucide 1.x that named export does not exist and the module fails to evaluate:

```
SyntaxError: Named export 'Github' not found.
```

The brand mark is no longer re-exported from `@tesserix/icons/web` or `@tesserix/icons/native`. `GitHub` and `GitLab` are now inline SVG components in `@tesserix/icons/custom`, alongside the other brand marks, so they no longer depend on what lucide chooses to ship.

The `lucide-react` and `lucide-react-native` peer ranges on `@tesserix/icons` and `@tesserix/web` widen to `^0.469.0 || ^1.0.0`. Every other icon in the curated re-export list exists unchanged in lucide 1.x.

Consumers importing `Github` from `@tesserix/icons/web` should switch to `import { GitHub } from '@tesserix/icons/custom'`. On lucide 0.x the old import still resolves through the `export *`.
