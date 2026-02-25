const formatMessage = (format: string, args: unknown[]): string => {
  let index = 0
  return format.replace(/%s/g, () => String(args[index++]))
}

export default function warning(condition: unknown, format?: string, ...args: unknown[]): void {
  if (condition || !format) return

  // Keep warning behavior non-fatal in Storybook runtime.
  // eslint-disable-next-line no-console
  console.warn(formatMessage(format, args))
}
