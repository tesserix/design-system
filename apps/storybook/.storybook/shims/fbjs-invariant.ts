const formatMessage = (format: string, args: unknown[]): string => {
  let index = 0
  return format.replace(/%s/g, () => String(args[index++]))
}

export default function invariant(condition: unknown, format?: string, ...args: unknown[]): asserts condition {
  if (condition) return

  if (!format) {
    throw new Error(
      'Minified exception occurred; use the non-minified dev environment for the full error message.'
    )
  }

  const error = new Error(formatMessage(format, args))
  error.name = 'Invariant Violation'
  throw error
}
