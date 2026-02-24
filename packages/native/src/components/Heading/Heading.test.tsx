import React from 'react'
import { render } from '@testing-library/react-native'
import { Heading, H1, H2, H3, H4, H5, H6 } from './Heading'

describe('Heading', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Heading testID="heading">Title</Heading>)
    expect(getByTestId('heading')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<Heading>Hello World</Heading>)
    expect(getByText('Hello World')).toBeTruthy()
  })

  it('renders with different levels', () => {
    const levels: Array<'1' | '2' | '3' | '4' | '5' | '6'> = ['1', '2', '3', '4', '5', '6']
    levels.forEach((level) => {
      const { getByTestId } = render(
        <Heading testID={`heading-${level}`} level={level}>
          Heading Level {level}
        </Heading>
      )
      expect(getByTestId(`heading-${level}`)).toBeTruthy()
    })
  })

  it('renders with custom size', () => {
    const { getByTestId } = render(
      <Heading testID="heading" size="3xl">
        Custom Size
      </Heading>
    )
    expect(getByTestId('heading')).toBeTruthy()
  })

  it('renders with custom color', () => {
    const { getByTestId } = render(
      <Heading testID="heading" color="#FF0000">
        Colored Heading
      </Heading>
    )
    expect(getByTestId('heading')).toBeTruthy()
  })

  it('renders with text alignment', () => {
    const { getByTestId } = render(
      <Heading testID="heading" align="center">
        Centered Heading
      </Heading>
    )
    expect(getByTestId('heading')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Heading ref={ref}>Heading</Heading>)
    expect(ref.current).toBeTruthy()
  })
})

describe('H1', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<H1 testID="h1">H1 Title</H1>)
    expect(getByTestId('h1')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<H1>H1 Content</H1>)
    expect(getByText('H1 Content')).toBeTruthy()
  })
})

describe('H2', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<H2 testID="h2">H2 Title</H2>)
    expect(getByTestId('h2')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<H2>H2 Content</H2>)
    expect(getByText('H2 Content')).toBeTruthy()
  })
})

describe('H3', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<H3 testID="h3">H3 Title</H3>)
    expect(getByTestId('h3')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<H3>H3 Content</H3>)
    expect(getByText('H3 Content')).toBeTruthy()
  })
})

describe('H4', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<H4 testID="h4">H4 Title</H4>)
    expect(getByTestId('h4')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<H4>H4 Content</H4>)
    expect(getByText('H4 Content')).toBeTruthy()
  })
})

describe('H5', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<H5 testID="h5">H5 Title</H5>)
    expect(getByTestId('h5')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<H5>H5 Content</H5>)
    expect(getByText('H5 Content')).toBeTruthy()
  })
})

describe('H6', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<H6 testID="h6">H6 Title</H6>)
    expect(getByTestId('h6')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<H6>H6 Content</H6>)
    expect(getByText('H6 Content')).toBeTruthy()
  })
})
