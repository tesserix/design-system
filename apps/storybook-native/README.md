# Native Storybook (Expo)

Local native component Storybook app for `@tesserix/native`.

## Run

- `pnpm --filter @tesserix/storybook-native storybook`
- `pnpm --filter @tesserix/storybook-native storybook:web`

## Notes

- This app is intentionally separate from the web Storybook app.
- Stories are loaded from `packages/native/src/**/*.stories.tsx` (currently a curated list in `.storybook/index.tsx`).
