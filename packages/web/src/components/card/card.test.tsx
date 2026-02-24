import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'

describe('Card', () => {
  it('renders card correctly', () => {
    render(<Card data-testid="card">Card content</Card>)
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('applies default card styles', () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('rounded-xl', 'border', 'bg-card')
  })

  it('applies custom className to card', () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })
})

describe('CardHeader', () => {
  it('renders card header correctly', () => {
    render(<CardHeader data-testid="card-header">Header content</CardHeader>)
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
  })

  it('applies default header styles', () => {
    render(<CardHeader data-testid="card-header">Header</CardHeader>)
    const header = screen.getByTestId('card-header')
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
  })

  it('applies custom className to header', () => {
    render(<CardHeader className="custom-header" data-testid="card-header">Header</CardHeader>)
    expect(screen.getByTestId('card-header')).toHaveClass('custom-header')
  })
})

describe('CardTitle', () => {
  it('renders card title correctly', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>)
    expect(screen.getByTestId('card-title')).toBeInTheDocument()
  })

  it('applies default title styles', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>)
    const title = screen.getByTestId('card-title')
    expect(title).toHaveClass('text-2xl', 'font-bold', 'leading-tight')
  })

  it('applies custom className to title', () => {
    render(<CardTitle className="custom-title" data-testid="card-title">Title</CardTitle>)
    expect(screen.getByTestId('card-title')).toHaveClass('custom-title')
  })
})

describe('CardDescription', () => {
  it('renders card description correctly', () => {
    render(<CardDescription data-testid="card-desc">Description</CardDescription>)
    expect(screen.getByTestId('card-desc')).toBeInTheDocument()
  })

  it('applies default description styles', () => {
    render(<CardDescription data-testid="card-desc">Description</CardDescription>)
    const desc = screen.getByTestId('card-desc')
    expect(desc).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('applies custom className to description', () => {
    render(<CardDescription className="custom-desc" data-testid="card-desc">Desc</CardDescription>)
    expect(screen.getByTestId('card-desc')).toHaveClass('custom-desc')
  })
})

describe('CardContent', () => {
  it('renders card content correctly', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>)
    expect(screen.getByTestId('card-content')).toBeInTheDocument()
  })

  it('applies default content styles', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>)
    const content = screen.getByTestId('card-content')
    expect(content).toHaveClass('p-6', 'pt-0')
  })

  it('applies custom className to content', () => {
    render(<CardContent className="custom-content" data-testid="card-content">Content</CardContent>)
    expect(screen.getByTestId('card-content')).toHaveClass('custom-content')
  })
})

describe('CardFooter', () => {
  it('renders card footer correctly', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>)
    expect(screen.getByTestId('card-footer')).toBeInTheDocument()
  })

  it('applies default footer styles', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>)
    const footer = screen.getByTestId('card-footer')
    expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
  })

  it('applies custom className to footer', () => {
    render(<CardFooter className="custom-footer" data-testid="card-footer">Footer</CardFooter>)
    expect(screen.getByTestId('card-footer')).toHaveClass('custom-footer')
  })
})

describe('Card composition', () => {
  it('renders complete card with all components', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Card Title</CardTitle>
          <CardDescription data-testid="description">Card Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="content">
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter data-testid="footer">
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('title')).toHaveTextContent('Card Title')
    expect(screen.getByTestId('description')).toHaveTextContent('Card Description')
    expect(screen.getByTestId('content')).toHaveTextContent('Card content goes here')
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
  })
})
