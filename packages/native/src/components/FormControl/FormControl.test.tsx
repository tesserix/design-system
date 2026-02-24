import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Field, FormControl } from './FormControl'

describe('FormControl', () => {
  it('renders label and helper text', () => {
    const { getByText } = render(
      <FormControl label="Email" helperText="Use your work email">
        <Text>Child</Text>
      </FormControl>
    )

    expect(getByText('Email')).toBeTruthy()
    expect(getByText('Use your work email')).toBeTruthy()
  })

  it('renders error text instead of helper text when invalid', () => {
    const { getByText, queryByText } = render(
      <FormControl
        label="Email"
        helperText="Use your work email"
        errorMessage="Invalid email"
        isInvalid
      >
        <Text>Child</Text>
      </FormControl>
    )

    expect(getByText('Invalid email')).toBeTruthy()
    expect(queryByText('Use your work email')).toBeNull()
  })
})

describe('Field', () => {
  it('injects form state and accessibility props into child component', () => {
    let receivedProps: Record<string, unknown> = {}

    const MockInput = (props: Record<string, unknown>) => {
      receivedProps = props
      return <Text>MockInput</Text>
    }

    render(
      <Field
        label="Username"
        helperText="Required"
        errorMessage="Invalid username"
        isInvalid
        isDisabled
      >
        <MockInput />
      </Field>
    )

    expect(receivedProps.isInvalid).toBe(true)
    expect(receivedProps.error).toBe(true)
    expect(receivedProps.isDisabled).toBe(true)
    expect(receivedProps.disabled).toBe(true)
    expect(receivedProps.accessibilityLabel).toBe('Username')
    expect(receivedProps.accessibilityHint).toBe('Invalid username')
  })
})
