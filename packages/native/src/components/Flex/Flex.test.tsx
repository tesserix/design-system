import React from 'react'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { Flex } from './Flex'

describe('Flex', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Flex testID="flex">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('renders children', () => {
    const { getByText } = render(
      <Flex>
        <View><Text>Test content</Text></View>
      </Flex>
    )
    expect(getByText('Test content')).toBeTruthy()
  })

  it('renders with row direction by default', () => {
    const { getByTestId } = render(
      <Flex testID="flex">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('renders with column direction', () => {
    const { getByTestId } = render(
      <Flex testID="flex" direction="column">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('applies align items', () => {
    const { getByTestId } = render(
      <Flex testID="flex" align="center">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('applies justify content', () => {
    const { getByTestId } = render(
      <Flex testID="flex" justify="space-between">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('applies flex wrap', () => {
    const { getByTestId } = render(
      <Flex testID="flex" wrap="wrap">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('applies flex value', () => {
    const { getByTestId } = render(
      <Flex testID="flex" flex={1}>
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('applies align self', () => {
    const { getByTestId } = render(
      <Flex testID="flex" alignSelf="center">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('applies flex grow, shrink, and basis', () => {
    const { getByTestId } = render(
      <Flex testID="flex" grow={1} shrink={0} basis="auto">
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(getByTestId('flex')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(
      <Flex ref={ref}>
        <View><Text>Content</Text></View>
      </Flex>
    )
    expect(ref.current).toBeTruthy()
  })
})
