import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, waitFor } from 'storybook/test'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

const meta = {
  title: 'Layout/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether only one or multiple items can be open',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'single' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'The default open items',
      table: {
        type: { summary: 'string | string[]' },
      },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Collapsible Sections</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Accordion Showcase</h2>
          <p className="text-sm text-muted-foreground">Expandable content sections.</p>
        </div>

        <div className="space-y-6">
          <Accordion type="single" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger value="item-1">Is it accessible?</AccordionTrigger>
              <AccordionContent value="item-1">
                Yes. It adheres to the WAI-ARIA design pattern and includes proper ARIA attributes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger value="item-2">Is it styled?</AccordionTrigger>
              <AccordionContent value="item-2">
                Yes. It comes with default styles that match your design system's theme.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger value="item-3">Is it animated?</AccordionTrigger>
              <AccordionContent value="item-3">
                Yes. The accordion includes smooth transitions when expanding and collapsing.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Multiple Open Items</h3>
            <Accordion type="multiple" defaultValue={["faq-1", "faq-2"]}>
              <AccordionItem value="faq-1">
                <AccordionTrigger value="faq-1">How do I get started?</AccordionTrigger>
                <AccordionContent value="faq-1">
                  Simply import the component and start using it in your application.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger value="faq-2">Can I customize it?</AccordionTrigger>
                <AccordionContent value="faq-2">
                  Yes, all components accept className props for custom styling.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger value="faq-3">Is TypeScript supported?</AccordionTrigger>
                <AccordionContent value="faq-3">
                  Absolutely! All components are built with TypeScript.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Single: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-1" className="w-[500px]">
      <AccordionItem value="item-1">
        <AccordionTrigger value="item-1">Section 1</AccordionTrigger>
        <AccordionContent value="item-1">Content for section 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger value="item-2">Section 2</AccordionTrigger>
        <AccordionContent value="item-2">Content for section 2</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas }) => {
    const section1 = canvas.getByRole('button', { name: /section 1/i })
    const section2 = canvas.getByRole('button', { name: /section 2/i })

    // Section 1 should be open by default
    await expect(section1).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText(/content for section 1/i)).toBeInTheDocument()

    // Click section 2
    fireEvent.click(section2)

    // Wait for section 2 to expand and section 1 to collapse
    await waitFor(() => {
      expect(section2).toHaveAttribute('aria-expanded', 'true')
      expect(canvas.getByText(/content for section 2/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(section1).toHaveAttribute('aria-expanded', 'false')
      expect(canvas.queryByText(/content for section 1/i)).not.toBeInTheDocument()
    })
  },
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["item-1"]} className="w-[500px]">
      <AccordionItem value="item-1">
        <AccordionTrigger value="item-1">Section 1</AccordionTrigger>
        <AccordionContent value="item-1">Content for section 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger value="item-2">Section 2</AccordionTrigger>
        <AccordionContent value="item-2">Content for section 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger value="item-3">Section 3</AccordionTrigger>
        <AccordionContent value="item-3">Content for section 3</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
