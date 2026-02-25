import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { Input } from '../Input'
import {
  Form,
  FormField,
  createYupAdapter,
  createZodAdapter,
  useFieldArray,
  useForm,
  useFormContext,
} from './Form'

describe('Form', () => {
  it(
    'submits when validation passes',
    async () => {
      const onSubmit = jest.fn()

      const Harness = () => {
        const form = useForm({
          initialValues: { name: '' },
          validate: (values) => (values.name ? {} : { name: 'Name is required' }),
          onSubmit,
        })

        return (
          <Form form={form}>
            <FormField name="name" label="Name">
              <Input testID="name-input" />
            </FormField>
            <TouchableOpacity testID="submit" onPress={() => void form.handleSubmit()}>
              <Text>Submit</Text>
            </TouchableOpacity>
          </Form>
        )
      }

      const { getByTestId, getAllByText, queryByText } = render(<Harness />)

      fireEvent.press(getByTestId('submit'))

      await waitFor(
        () => {
          expect(getAllByText('Name is required').length).toBeGreaterThan(0)
          expect(onSubmit).not.toHaveBeenCalled()
        },
        { timeout: 3000 }
      )

      fireEvent.changeText(getByTestId('name-input'), 'Alice')
      fireEvent.press(getByTestId('submit'))

      await waitFor(
        () => {
          expect(queryByText('Name is required')).toBeNull()
          expect(onSubmit).toHaveBeenCalledWith({ name: 'Alice' })
        },
        { timeout: 3000 }
      )
    },
    10000
  )

  it('binds boolean values through FormField child render', async () => {
    const CurrentValue = () => {
      const form = useFormContext<{ marketing: boolean }>()
      return <Text testID="current-value">{String(form.values.marketing)}</Text>
    }

    const Harness = () => {
      const form = useForm({ initialValues: { marketing: false } })

      return (
        <Form form={form}>
          <FormField name="marketing" label="Marketing updates">
            {(field) => (
              <TouchableOpacity
                testID="toggle-marketing"
                onPress={() => field.onChange(!field.isChecked)}
              >
                <Text>{field.isChecked ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            )}
          </FormField>
          <CurrentValue />
        </Form>
      )
    }

    const { getByTestId, getByText } = render(<Harness />)

    expect(getByText('OFF')).toBeTruthy()
    expect(getByTestId('current-value').props.children).toBe('false')

    fireEvent.press(getByTestId('toggle-marketing'))

    await waitFor(() => {
      expect(getByText('ON')).toBeTruthy()
      expect(getByTestId('current-value').props.children).toBe('true')
    })
  })

  it('supports array operations through useFieldArray', async () => {
    const Harness = () => {
      const form = useForm({ initialValues: { tags: ['one'] as string[] } })
      const array = useFieldArray(form, 'tags')

      return (
        <Form form={form}>
          <Text testID="count">{array.items.length}</Text>
          <TouchableOpacity testID="append" onPress={() => array.append('two')}>
            <Text>Append</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="remove" onPress={() => array.remove(0)}>
            <Text>Remove</Text>
          </TouchableOpacity>
        </Form>
      )
    }

    const { getByTestId } = render(<Harness />)

    expect(getByTestId('count').props.children).toBe(1)

    fireEvent.press(getByTestId('append'))
    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(2)
    })

    fireEvent.press(getByTestId('remove'))
    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(1)
    })
  })

  it('maps zod adapter issues into field errors', async () => {
    const adapter = createZodAdapter<{ email: string }>({
      safeParse: () => ({
        success: false,
        error: {
          issues: [{ path: ['email'], message: 'Invalid email' }],
        },
      }),
    })

    await expect(adapter.validate({ email: 'bad' })).resolves.toEqual({
      email: 'Invalid email',
    })
  })

  it('maps yup adapter inner errors into field errors', async () => {
    const adapter = createYupAdapter<{ password: string }>({
      validate: async () => {
        throw {
          inner: [{ path: 'password', message: 'Password too short' }],
        }
      },
    })

    await expect(adapter.validate({ password: '123' })).resolves.toEqual({
      password: 'Password too short',
    })
  })
})
