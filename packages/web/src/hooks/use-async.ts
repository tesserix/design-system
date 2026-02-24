import { useCallback, useEffect, useState } from "react"

interface UseAsyncState<T> {
  /**
   * Loading state
   */
  isLoading: boolean
  /**
   * Error if operation failed
   */
  error: Error | null
  /**
   * Result data if operation succeeded
   */
  data: T | null
  /**
   * Status of the async operation
   */
  status: "idle" | "pending" | "success" | "error"
}

interface UseAsyncResult<T> extends UseAsyncState<T> {
  /**
   * Execute the async function
   */
  execute: (...args: unknown[]) => Promise<T | null>
  /**
   * Reset the state
   */
  reset: () => void
}

/**
 * Hook for managing async operations state
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately on mount
 * @returns State and control functions for the async operation
 */
export function useAsync<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  immediate = false
): UseAsyncResult<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    isLoading: false,
    error: null,
    data: null,
    status: "idle",
  })

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState({
        isLoading: true,
        error: null,
        data: null,
        status: "pending",
      })

      try {
        const response = await asyncFunction(...args)
        setState({
          isLoading: false,
          error: null,
          data: response,
          status: "success",
        })
        return response
      } catch (error) {
        setState({
          isLoading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
          data: null,
          status: "error",
        })
        return null
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null,
      status: "idle",
    })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { ...state, execute, reset }
}
