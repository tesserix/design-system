import React from 'react'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { Carousel } from './Carousel'

describe('Carousel', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Carousel>
        {[
          <View key="1">
            <Text>Slide 1</Text>
          </View>,
          <View key="2">
            <Text>Slide 2</Text>
          </View>,
        ]}
      </Carousel>
    )

    expect(getByText('Slide 1')).toBeTruthy()
    expect(getByText('Slide 2')).toBeTruthy()
  })

  it('hides pagination when showPagination is false', () => {
    const { queryByRole } = render(
      <Carousel showPagination={false}>
        {[
          <View key="1">
            <Text>Slide 1</Text>
          </View>,
          <View key="2">
            <Text>Slide 2</Text>
          </View>,
        ]}
      </Carousel>
    )

    expect(queryByRole('none')).toBeNull()
  })
})
