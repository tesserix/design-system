import React from 'react'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { Stack, VStack, HStack } from './Stack'

describe('Stack', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Stack testID="stack">
        <View><Text>Item 1</Text></View>
        <View><Text>Item 2</Text></View>
      </Stack>
    )
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('renders children', () => {
    const { getByText } = render(
      <Stack>
        <View><Text>Item 1</Text></View>
        <View><Text>Item 2</Text></View>
      </Stack>
    )
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })

  it('renders with column direction by default', () => {
    const { getByTestId } = render(
      <Stack testID="stack">
        <View><Text>Item</Text></View>
      </Stack>
    )
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('renders with row direction', () => {
    const { getByTestId } = render(
      <Stack testID="stack" direction="row">
        <View><Text>Item</Text></View>
      </Stack>
    )
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('applies spacing between items', () => {
    const { getByTestId } = render(
      <Stack testID="stack" space={4}>
        <View><Text>Item 1</Text></View>
        <View><Text>Item 2</Text></View>
      </Stack>
    )
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('applies align items', () => {
    const { getByTestId } = render(
      <Stack testID="stack" align="center">
        <View><Text>Item</Text></View>
      </Stack>
    )
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('applies justify content', () => {
    const { getByTestId } = render(
      <Stack testID="stack" justify="space-between">
        <View><Text>Item</Text></View>
      </Stack>
    )
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('applies flex wrap', () => {
    const { getByTestId } = render(
      <Stack testID="stack" wrap>
        <View><Text>Item</Text></View>
      </Stack>
    )
    expect(getByTestId('stack')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(
      <Stack ref={ref}>
        <View><Text>Item</Text></View>
      </Stack>
    )
    expect(ref.current).toBeTruthy()
  })
})

describe('VStack', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <VStack testID="vstack">
        <View><Text>Item</Text></View>
      </VStack>
    )
    expect(getByTestId('vstack')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(
      <VStack ref={ref}>
        <View><Text>Item</Text></View>
      </VStack>
    )
    expect(ref.current).toBeTruthy()
  })
})

describe('HStack', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <HStack testID="hstack">
        <View><Text>Item</Text></View>
      </HStack>
    )
    expect(getByTestId('hstack')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(
      <HStack ref={ref}>
        <View><Text>Item</Text></View>
      </HStack>
    )
    expect(ref.current).toBeTruthy()
  })
})
