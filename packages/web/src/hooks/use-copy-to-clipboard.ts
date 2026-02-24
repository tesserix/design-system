import { useState } from "react"

interface CopyToClipboardResult {
  /**
   * The value that was copied
   */
  value: string | null
  /**
   * Function to copy text to clipboard
   */
  copy: (text: string) => Promise<void>
  /**
   * Error if copy failed
   */
  error: Error | null
  /**
   * Whether the copy was successful
   */
  copied: boolean
}

/**
 * Hook that provides copy to clipboard functionality
 * @returns Object with copy function, copied state, value, and error
 */
export function useCopyToClipboard(): CopyToClipboardResult {
  const [value, setValue] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      setError(new Error("Clipboard not supported"))
      setCopied(false)
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setValue(text)
      setError(null)
      setCopied(true)

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to copy"))
      setValue(null)
      setCopied(false)
    }
  }

  return { value, copy, error, copied }
}
