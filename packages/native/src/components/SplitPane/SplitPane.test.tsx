import React from 'react'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { SplitPane } from './SplitPane'

describe('SplitPane', () => {
  it('renders both panes', () => {
    const { getByText } = render(
      <SplitPane
        first={
          <View>
            <Text>First Pane</Text>
          </View>
        }
        second={
          <View>
            <Text>Second Pane</Text>
          </View>
        }
      />
    )
    expect(getByText('First Pane')).toBeTruthy()
    expect(getByText('Second Pane')).toBeTruthy()
  })

  it('renders horizontal layout by default', () => {
    const { getByLabelText } = render(
      <SplitPane
        first={<View><Text>First</Text></View>}
        second={<View><Text>Second</Text></View>}
      />
    )
    expect(getByLabelText('Resize divider')).toBeTruthy()
  })

  it('renders vertical layout', () => {
    const { getByLabelText } = render(
      <SplitPane
        orientation="vertical"
        first={<View><Text>First</Text></View>}
        second={<View><Text>Second</Text></View>}
      />
    )
    expect(getByLabelText('Resize divider')).toBeTruthy()
  })

  it('uses initial ratio', () => {
    const { getByLabelText } = render(
      <SplitPane
        initialRatio={0.7}
        first={<View><Text>First</Text></View>}
        second={<View><Text>Second</Text></View>}
      />
    )
    expect(getByLabelText('Resize divider').props.accessibilityValue).toEqual(
      expect.objectContaining({ now: 70 })
    )
  })
})
