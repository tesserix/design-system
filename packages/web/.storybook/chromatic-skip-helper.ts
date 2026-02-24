/**
 * Wrap a play function to skip execution in Chromatic while keeping it for local Vitest tests.
 *
 * Chromatic should focus on visual regression only.
 * Interaction tests run locally via `npm run test:storybook`.
 *
 * @example
 * export const MyStory: Story = {
 *   play: skipInChromatic(async ({ canvas }) => {
 *     // Your test logic
 *   })
 * }
 */
export function skipInChromatic<T extends (...args: any[]) => any>(playFn: T): T {
  return (async (...args: Parameters<T>) => {
    // Check if running in Chromatic environment
    const isChromatic =
      // Chromatic sets this global
      (globalThis as any).isChromatic ||
      // Chromatic URL pattern
      globalThis.location?.href?.includes('chromatic.com') ||
      // Chromatic sets this env var in their build
      process.env.CHROMATIC

    if (isChromatic) {
      console.log('[Chromatic] Skipping play function for visual-only snapshot')
      return
    }

    // Run play function normally in local/Vitest environment
    return await playFn(...args)
  }) as T
}
