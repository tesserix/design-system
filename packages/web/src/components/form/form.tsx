import * as React from "react"

import { cn } from "../../lib/utils"
import { Label } from "../label"

type FormFieldContextValue = {
  id: string
  name: string
  error?: string
  invalid?: boolean
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const useFormField = () => {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error("useFormField must be used within FormField")
  }
  return context
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn("space-y-6", className)} {...props} />
  )
)
Form.displayName = "Form"

export interface FormFieldProps {
  name: string
  children: React.ReactNode
  error?: string
}

const FormField = ({ name, children, error }: FormFieldProps) => {
  const id = React.useId()

  return (
    <FormFieldContext.Provider
      value={{
        id,
        name,
        error,
        invalid: !!error,
      }}
    >
      {children}
    </FormFieldContext.Provider>
  )
}
FormField.displayName = "FormField"

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
)
FormItem.displayName = "FormItem"

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    const { id, invalid } = useFormField()

    return (
      <Label
        ref={ref}
        htmlFor={id}
        className={cn(invalid && "text-destructive", className)}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
    )
  }
)
FormLabel.displayName = "FormLabel"

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ ...props }, ref) => {
    const { id, invalid } = useFormField()

    return (
      <div ref={ref} {...props}>
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              id,
              "aria-invalid": invalid,
              "aria-describedby": invalid ? `${id}-error` : undefined,
            })
          }
          return child
        })}
      </div>
    )
  }
)
FormControl.displayName = "FormControl"

export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { id, error } = useFormField()

    if (!error && !children) {
      return null
    }

    return (
      <p
        ref={ref}
        id={`${id}-error`}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {error || children}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
