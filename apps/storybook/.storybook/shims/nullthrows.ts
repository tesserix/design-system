export default function nullthrows<T>(value: T | null | undefined, message?: string): T {
  if (value != null) return value

  const error = new Error(message ?? `Got unexpected ${String(value)}`)
  ;(error as Error & { framesToPop?: number }).framesToPop = 1
  throw error
}
