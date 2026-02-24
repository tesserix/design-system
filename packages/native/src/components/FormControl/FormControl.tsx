import React from 'react'
import { TextStyle, View, ViewProps, ViewStyle } from 'react-native'
import { Text } from '../Text'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

interface FormControlContextValue {
  isInvalid: boolean
  isDisabled: boolean
  isRequired: boolean
}

const FormControlContext = React.createContext<FormControlContextValue | undefined>(undefined)

const useFormControlContext = (): FormControlContextValue => {
  return React.useContext(FormControlContext) ?? {
    isInvalid: false,
    isDisabled: false,
    isRequired: false,
  }
}

export interface FormControlProps extends Omit<ViewProps, 'children'> {
  children: React.ReactNode
  label?: string
  helperText?: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  style?: ViewStyle
  labelStyle?: TextStyle
  helperTextStyle?: TextStyle
  errorTextStyle?: TextStyle
}

export interface LabelProps {
  children: React.ReactNode
  style?: TextStyle
}

export interface HelperTextProps {
  children: React.ReactNode
  style?: TextStyle
}

export interface ErrorTextProps {
  children: React.ReactNode
  style?: TextStyle
}

export const Label: React.FC<LabelProps> = ({ children, style }) => {
  const { isDisabled, isRequired } = useFormControlContext()
  return (
    <Text
      size="sm"
      style={[
        {
          fontSize: fontSize.sm,
          fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
          color: isDisabled ? '#9ca3af' : '#374151',
          marginBottom: spacing[1],
        },
        style,
      ]}
    >
      {children}
      {isRequired ? ' *' : ''}
    </Text>
  )
}

export const HelperText: React.FC<HelperTextProps> = ({ children, style }) => {
  const { isDisabled } = useFormControlContext()
  return (
    <Text
      size="xs"
      style={[
        {
          color: isDisabled ? '#9ca3af' : '#6b7280',
          marginTop: spacing[1],
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export const ErrorText: React.FC<ErrorTextProps> = ({ children, style }) => {
  return (
    <Text
      size="xs"
      style={[
        {
          color: '#ef4444',
          marginTop: spacing[1],
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export interface FieldProps extends Omit<FormControlProps, 'children'> {
  children: React.ReactElement
}

export const Field: React.FC<FieldProps> = ({
  children,
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  style,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  ...props
}) => {
  const childElement = children as React.ReactElement<Record<string, unknown>>
  const childProps = childElement.props
  const clonedChild = React.cloneElement(childElement, {
    ...(isInvalid !== undefined ? { isInvalid, error: isInvalid } : {}),
    ...(isDisabled !== undefined ? { isDisabled, disabled: isDisabled } : {}),
    accessibilityLabel: childProps.accessibilityLabel ?? label,
    accessibilityHint: childProps.accessibilityHint ?? (isInvalid ? errorMessage : helperText),
  })

  return (
    <FormControl
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isRequired={isRequired}
      style={style}
      labelStyle={labelStyle}
      helperTextStyle={helperTextStyle}
      errorTextStyle={errorTextStyle}
      {...props}
    >
      {clonedChild}
    </FormControl>
  )
}

export const FormControl: React.FC<FormControlProps> = ({
  children,
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  style,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  ...props
}) => {
  const contextValue = React.useMemo(
    () => ({
      isInvalid,
      isDisabled,
      isRequired,
    }),
    [isDisabled, isInvalid, isRequired]
  )

  return (
    <FormControlContext.Provider value={contextValue}>
      <View style={style} {...props}>
        {label ? <Label style={labelStyle}>{label}</Label> : null}
        {children}
        {isInvalid && errorMessage ? (
          <ErrorText style={errorTextStyle}>{errorMessage}</ErrorText>
        ) : helperText ? (
          <HelperText style={helperTextStyle}>{helperText}</HelperText>
        ) : null}
      </View>
    </FormControlContext.Provider>
  )
}

FormControl.displayName = 'FormControl'
