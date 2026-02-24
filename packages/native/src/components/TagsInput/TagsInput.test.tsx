import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { TagsInput } from './TagsInput'

describe('TagsInput', () => {
  it('renders tags input', () => {
    const { getByLabelText } = render(<TagsInput />)
    expect(getByLabelText('Tags input')).toBeTruthy()
  })

  it('renders existing tags', () => {
    const { getByText } = render(
      <TagsInput value={['React', 'TypeScript']} />
    )
    expect(getByText('React')).toBeTruthy()
    expect(getByText('TypeScript')).toBeTruthy()
  })

  it('calls onChange when tag is removed', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <TagsInput value={['React']} onChange={onChange} />
    )
    const removeButton = getByLabelText('Remove tag React')
    fireEvent.press(removeButton)
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('renders label', () => {
    const { getByText } = render(<TagsInput label="Skills" />)
    expect(getByText('Skills')).toBeTruthy()
  })

  it('shows error message', () => {
    const { getByText } = render(<TagsInput error="Required field" />)
    expect(getByText('Required field')).toBeTruthy()
  })
})
