import { useCallback, useState } from "react"

export type FormErrors<T> = Partial<Record<keyof T, string>>

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => FormErrors<T>
}

interface UseFormResult<T> {
  values: T
  errors: FormErrors<T>
  isSubmitting: boolean
  setValue: <K extends keyof T>(key: K, value: T[K]) => void
  setValues: (values: T) => void
  handleChange: <K extends keyof T>(key: K) => (value: T[K]) => void
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (event?: { preventDefault?: () => void }) => Promise<void>
  reset: () => void
}

/**
 * Lightweight form state helper with optional validation.
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
}: UseFormOptions<T>): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleChange = useCallback(
    <K extends keyof T>(key: K) =>
      (value: T[K]) => {
        setValue(key, value)
      },
    [setValue]
  )

  const handleSubmit = useCallback(
    (onSubmit: (formValues: T) => Promise<void> | void) =>
      async (event?: { preventDefault?: () => void }) => {
        event?.preventDefault?.()

        const nextErrors = validate ? validate(values) : {}
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
          return
        }

        setIsSubmitting(true)
        try {
          await onSubmit(values)
        } finally {
          setIsSubmitting(false)
        }
      },
    [validate, values]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setValues,
    handleChange,
    handleSubmit,
    reset,
  }
}
