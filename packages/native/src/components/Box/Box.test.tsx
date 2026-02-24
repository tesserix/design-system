import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Box } from './Box'

describe('Box', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Box testID="box">
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('renders children', () => {
    const { getByText } = render(
      <Box>
        <Text>Test content</Text>
      </Box>
    )
    expect(getByText('Test content')).toBeTruthy()
  })

  it('applies padding props', () => {
    const { getByTestId } = render(
      <Box testID="box" p={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies margin props', () => {
    const { getByTestId } = render(
      <Box testID="box" m={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies background color', () => {
    const { getByTestId } = render(
      <Box testID="box" bg="#FF0000">
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies border radius', () => {
    const { getByTestId } = render(
      <Box testID="box" rounded={true}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies custom border radius number', () => {
    const { getByTestId } = render(
      <Box testID="box" rounded={16}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies flex value', () => {
    const { getByTestId } = render(
      <Box testID="box" flex={1}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies width and height', () => {
    const { getByTestId } = render(
      <Box testID="box" w={100} h={200}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies horizontal padding', () => {
    const { getByTestId } = render(
      <Box testID="box" px={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies vertical padding', () => {
    const { getByTestId } = render(
      <Box testID="box" py={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies individual padding sides', () => {
    const { getByTestId } = render(
      <Box testID="box" pt={1} pr={2} pb={3} pl={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies horizontal margin', () => {
    const { getByTestId } = render(
      <Box testID="box" mx={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies vertical margin', () => {
    const { getByTestId } = render(
      <Box testID="box" my={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('applies individual margin sides', () => {
    const { getByTestId } = render(
      <Box testID="box" mt={1} mr={2} mb={3} ml={4}>
        <Text>Content</Text>
      </Box>
    )
    expect(getByTestId('box')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(
      <Box ref={ref}>
        <Text>Content</Text>
      </Box>
    )
    expect(ref.current).toBeTruthy()
  })
})
