import React from 'react'
import { View, ViewStyle } from 'react-native'
import { FormControl } from '../FormControl'

export type FormErrors<TValues extends Record<string, unknown>> = Partial<
  Record<keyof TValues, string>
>

export type FormTouched<TValues extends Record<string, unknown>> = Partial<
  Record<keyof TValues, boolean>
>

export type FormValidator<TValues extends Record<string, unknown>> = (
  values: TValues
) => FormErrors<TValues> | Promise<FormErrors<TValues>>

export interface SchemaAdapter<TValues extends Record<string, unknown>> {
  validate: (values: TValues) => Promise<FormErrors<TValues>>
}

export interface UseFormOptions<TValues extends Record<string, unknown>> {
  initialValues: TValues
  onSubmit?: (values: TValues) => void | Promise<void>
  validate?: FormValidator<TValues>
  schemaAdapter?: SchemaAdapter<TValues>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export interface FormController<TValues extends Record<string, unknown>> {
  values: TValues
  errors: FormErrors<TValues>
  touched: FormTouched<TValues>
  isSubmitting: boolean
  setValues: (nextValues: TValues) => void
  setFieldValue: <K extends keyof TValues>(name: K, value: TValues[K]) => void
  setFieldTouched: <K extends keyof TValues>(name: K, touched?: boolean) => void
  validateForm: () => Promise<FormErrors<TValues>>
  resetForm: () => void
  handleSubmit: () => Promise<void>
}

interface FormContextValue<TValues extends Record<string, unknown>> {
  form: FormController<TValues>
}

const FormContext = React.createContext<FormContextValue<Record<string, unknown>> | null>(null)

const callValidator = async <TValues extends Record<string, unknown>>(
  values: TValues,
  validator?: FormValidator<TValues>,
  schemaAdapter?: SchemaAdapter<TValues>
): Promise<FormErrors<TValues>> => {
  if (validator) {
    return validator(values)
  }

  if (schemaAdapter) {
    return schemaAdapter.validate(values)
  }

  return {}
}

const buildFieldError = (path: unknown, message: string): [string, string] | null => {
  if (Array.isArray(path)) {
    const key = path.join('.')
    return key ? [key, message] : null
  }

  if (typeof path === 'string' && path) {
    return [path, message]
  }

  return null
}

export const createZodAdapter = <TValues extends Record<string, unknown>>(
  schema: {
    safeParse?: (values: TValues) =>
      | { success: true; data: TValues }
      | {
          success: false
          error: {
            issues?: Array<{ path?: unknown; message?: string }>
          }
        }
    parse?: (values: TValues) => TValues
  }
): SchemaAdapter<TValues> => {
  return {
    validate: async (values: TValues) => {
      if (typeof schema.safeParse === 'function') {
        const result = schema.safeParse(values)
        if (result.success) {
          return {}
        }

        const issues = result.error?.issues ?? []
        const errors: Record<string, string> = {}
        issues.forEach((issue) => {
          const entry = buildFieldError(issue.path, issue.message ?? 'Invalid value')
          if (entry) {
            errors[entry[0]] = entry[1]
          }
        })
        return errors as FormErrors<TValues>
      }

      if (typeof schema.parse === 'function') {
        try {
          schema.parse(values)
          return {}
        } catch {
          return { form: 'Validation failed' } as FormErrors<TValues>
        }
      }

      return {}
    },
  }
}

export const createYupAdapter = <TValues extends Record<string, unknown>>(
  schema: {
    validate: (
      values: TValues,
      options?: { abortEarly?: boolean }
    ) => Promise<TValues>
  }
): SchemaAdapter<TValues> => {
  return {
    validate: async (values: TValues) => {
      try {
        await schema.validate(values, { abortEarly: false })
        return {}
      } catch (error: unknown) {
        const errors: Record<string, string> = {}
        const yupError = error as {
          inner?: Array<{ path?: string; message?: string }>
          path?: string
          message?: string
        }

        if (Array.isArray(yupError.inner) && yupError.inner.length > 0) {
          yupError.inner.forEach((entry) => {
            if (entry.path && !errors[entry.path]) {
              errors[entry.path] = entry.message ?? 'Invalid value'
            }
          })
          return errors as FormErrors<TValues>
        }

        if (yupError.path) {
          errors[yupError.path] = yupError.message ?? 'Invalid value'
          return errors as FormErrors<TValues>
        }

        return { form: 'Validation failed' } as FormErrors<TValues>
      }
    },
  }
}

export const useForm = <TValues extends Record<string, unknown>>(
  options: UseFormOptions<TValues>
): FormController<TValues> => {
  const {
    initialValues,
    onSubmit,
    validate,
    schemaAdapter,
    validateOnChange = false,
    validateOnBlur = true,
  } = options

  const [values, setValues] = React.useState<TValues>(initialValues)
  const [errors, setErrors] = React.useState<FormErrors<TValues>>({})
  const [touched, setTouched] = React.useState<FormTouched<TValues>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const validateForm = React.useCallback(async () => {
    const nextErrors = await callValidator(values, validate, schemaAdapter)
    setErrors(nextErrors)
    return nextErrors
  }, [schemaAdapter, validate, values])

  const setFieldValue = React.useCallback(
    <K extends keyof TValues>(name: K, value: TValues[K]) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value }
        if (validateOnChange) {
          void callValidator(next, validate, schemaAdapter).then(setErrors)
        }
        return next
      })
    },
    [schemaAdapter, validate, validateOnChange]
  )

  const setFieldTouched = React.useCallback(
    <K extends keyof TValues>(name: K, isTouched = true) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }))
      if (validateOnBlur) {
        void validateForm()
      }
    },
    [validateForm, validateOnBlur]
  )

  const resetForm = React.useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const handleSubmit = React.useCallback(async () => {
    const nextTouched: FormTouched<TValues> = {}
    ;(Object.keys(values) as Array<keyof TValues>).forEach((key) => {
      nextTouched[key] = true
    })
    setTouched(nextTouched)

    const nextErrors = await callValidator(values, validate, schemaAdapter)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !onSubmit) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit, schemaAdapter, validate, values])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValues,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    handleSubmit,
  }
}

export interface FormProps<TValues extends Record<string, unknown>> {
  form: FormController<TValues>
  children: React.ReactNode | ((form: FormController<TValues>) => React.ReactNode)
  style?: ViewStyle
}

export const Form = <TValues extends Record<string, unknown>>({
  form,
  children,
  style,
}: FormProps<TValues>) => {
  return (
    <FormContext.Provider value={{ form } as FormContextValue<Record<string, unknown>>}>
      <View style={style}>{typeof children === 'function' ? children(form) : children}</View>
    </FormContext.Provider>
  )
}

Form.displayName = 'Form'

export const useFormContext = <TValues extends Record<string, unknown>>() => {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }

  return context.form as FormController<TValues>
}

type FormFieldChildProps<TValue> = {
  value: TValue
  onChange: (value: TValue) => void
  onChangeText: (value: string) => void
  onBlur: () => void
  isChecked: boolean
}

export interface FormFieldProps<
  TValues extends Record<string, unknown>,
  K extends keyof TValues = keyof TValues,
> {
  name: K
  label?: string
  helperText?: string
  children:
    | React.ReactElement
    | ((field: FormFieldChildProps<TValues[K]>) => React.ReactNode)
}

export const FormField = <
  TValues extends Record<string, unknown>,
  K extends keyof TValues = keyof TValues,
>({
  name,
  label,
  helperText,
  children,
}: FormFieldProps<TValues, K>) => {
  const form = useFormContext<TValues>()
  const value = form.values[name]
  const isTouched = Boolean(form.touched[name])
  const fieldError = isTouched ? form.errors[name] : undefined
  const errorMessage = typeof fieldError === 'string' ? fieldError : undefined

  const field = {
    value,
    isChecked: Boolean(value),
    onChange: (nextValue: TValues[K]) => form.setFieldValue(name, nextValue),
    onChangeText: (nextValue: string) => form.setFieldValue(name, nextValue as TValues[K]),
    onBlur: () => form.setFieldTouched(name, true),
  }

  if (typeof children === 'function') {
    return (
      <FormControl
        label={label}
        helperText={helperText}
        isInvalid={Boolean(errorMessage)}
        errorMessage={errorMessage}
      >
        {children(field) as React.ReactElement}
      </FormControl>
    )
  }

  const child = children as React.ReactElement<Record<string, unknown>>
  const childProps = child.props
  const cloned = React.cloneElement(child, {
    ...(typeof value === 'boolean' || 'isChecked' in childProps ? { isChecked: Boolean(value) } : { value }),
    ...(childProps.onChangeText !== undefined || typeof value === 'string'
      ? { onChangeText: field.onChangeText }
      : { onChange: field.onChange }),
    onBlur: field.onBlur,
    ...(childProps.isInvalid === undefined ? { isInvalid: Boolean(errorMessage) } : {}),
    ...(childProps.errorMessage === undefined ? { errorMessage } : {}),
    ...(childProps.accessibilityLabel === undefined && label ? { accessibilityLabel: label } : {}),
    ...(childProps.accessibilityHint === undefined
      ? { accessibilityHint: errorMessage ?? helperText }
      : {}),
  })

  return (
    <FormControl
      label={label}
      helperText={helperText}
      isInvalid={Boolean(errorMessage)}
      errorMessage={errorMessage}
    >
      {cloned}
    </FormControl>
  )
}

FormField.displayName = 'FormField'

export const useFieldArray = <
  TValues extends Record<string, unknown>,
  K extends keyof TValues,
>(
  form: FormController<TValues>,
  name: K
) => {
  const items = (form.values[name] as unknown as unknown[]) ?? []

  return {
    items,
    append: (value: unknown) => {
      form.setFieldValue(name, [...items, value] as TValues[K])
    },
    remove: (index: number) => {
      form.setFieldValue(
        name,
        items.filter((_, currentIndex) => currentIndex !== index) as TValues[K]
      )
    },
    replace: (nextItems: unknown[]) => {
      form.setFieldValue(name, nextItems as TValues[K])
    },
    update: (index: number, value: unknown) => {
      form.setFieldValue(
        name,
        items.map((item, currentIndex) => (currentIndex === index ? value : item)) as TValues[K]
      )
    },
  }
}
