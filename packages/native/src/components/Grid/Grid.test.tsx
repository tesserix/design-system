import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Grid } from './Grid'

describe('Grid', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Grid>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </Grid>
    )
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })
})
