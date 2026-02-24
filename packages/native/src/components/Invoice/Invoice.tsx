import React from 'react'
import { View, Text, ScrollView, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InvoiceProps {
  /** Invoice number */
  invoiceNumber: string
  /** Invoice date */
  date: string
  /** Due date */
  dueDate: string
  /** Billing from info */
  from: {
    name: string
    address: string
    email?: string
    phone?: string
  }
  /** Billing to info */
  to: {
    name: string
    address: string
    email?: string
    phone?: string
  }
  /** Line items */
  items: InvoiceItem[]
  /** Subtotal */
  subtotal: number
  /** Tax amount */
  tax?: number
  /** Total amount */
  total: number
  /** Currency symbol */
  currency?: string
  /** Notes or payment terms */
  notes?: string
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * Invoice component - Invoice layout with line items, totals, billing info
 *
 * @example
 * ```tsx
 * <Invoice
 *   invoiceNumber="INV-001"
 *   date="2024-01-15"
 *   dueDate="2024-02-15"
 *   from={{ name: "Company Inc", address: "123 Street" }}
 *   to={{ name: "Client Co", address: "456 Avenue" }}
 *   items={[{ id: '1', description: 'Service', quantity: 1, unitPrice: 100, total: 100 }]}
 *   subtotal={100}
 *   total={100}
 * />
 * ```
 */
export const Invoice: React.FC<InvoiceProps> = ({
  invoiceNumber,
  date,
  dueDate,
  from,
  to,
  items,
  subtotal,
  tax,
  total,
  currency = '$',
  notes,
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    padding: spacing[6],
  }

  const headerStyle: ViewStyle = {
    marginBottom: spacing[6],
  }

  const titleStyle: TextStyle = {
    fontSize: fontSize['3xl'],
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[2],
  }

  const invoiceNumberStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#6b7280',
  }

  const sectionStyle: ViewStyle = {
    marginBottom: spacing[6],
  }

  const sectionTitleStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: spacing[2],
  }

  const nameStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[1],
  }

  const addressStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
    lineHeight: fontSize.sm * 1.5,
  }

  const tableStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing[6],
  }

  const tableHeaderStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  }

  const tableRowStyle: ViewStyle = {
    flexDirection: 'row',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  }

  const columnStyle = (flex: number): TextStyle => ({
    flex,
    fontSize: fontSize.sm,
    color: '#374151',
  })

  const headerColumnStyle = (flex: number): TextStyle => ({
    flex,
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#111827',
  })

  const totalsStyle: ViewStyle = {
    alignItems: 'flex-end',
    marginBottom: spacing[6],
  }

  const totalRowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing[2],
    minWidth: 250,
  }

  const totalLabelStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#6b7280',
    marginRight: spacing[4],
    flex: 1,
    textAlign: 'right',
  }

  const totalValueStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#111827',
    minWidth: 100,
    textAlign: 'right',
  }

  const grandTotalStyle: ViewStyle = {
    ...totalRowStyle,
    paddingTop: spacing[3],
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  }

  const grandTotalLabelStyle: TextStyle = {
    ...totalLabelStyle,
    fontSize: fontSize.lg,
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
  }

  const grandTotalValueStyle: TextStyle = {
    ...totalValueStyle,
    fontSize: fontSize.lg,
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
  }

  const notesStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
    lineHeight: fontSize.sm * 1.5,
  }

  return (
    <ScrollView style={[containerStyle, style]} testID={testID}>
      {/* Header */}
      <View style={headerStyle}>
        <Text style={titleStyle}>INVOICE</Text>
        <Text style={invoiceNumberStyle}>Invoice #: {invoiceNumber}</Text>
        <Text style={invoiceNumberStyle}>Date: {date}</Text>
        <Text style={invoiceNumberStyle}>Due Date: {dueDate}</Text>
      </View>

      {/* Billing Info */}
      <View style={{ flexDirection: 'row', marginBottom: spacing[6] }}>
        <View style={{ flex: 1, marginRight: spacing[4] }}>
          <Text style={sectionTitleStyle}>From</Text>
          <Text style={nameStyle}>{from.name}</Text>
          <Text style={addressStyle}>{from.address}</Text>
          {from.email && <Text style={addressStyle}>{from.email}</Text>}
          {from.phone && <Text style={addressStyle}>{from.phone}</Text>}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={sectionTitleStyle}>Bill To</Text>
          <Text style={nameStyle}>{to.name}</Text>
          <Text style={addressStyle}>{to.address}</Text>
          {to.email && <Text style={addressStyle}>{to.email}</Text>}
          {to.phone && <Text style={addressStyle}>{to.phone}</Text>}
        </View>
      </View>

      {/* Line Items */}
      <View style={tableStyle}>
        <View style={tableHeaderStyle}>
          <Text style={headerColumnStyle(3)}>Description</Text>
          <Text style={headerColumnStyle(1)}>Qty</Text>
          <Text style={headerColumnStyle(1)}>Unit Price</Text>
          <Text style={headerColumnStyle(1)}>Total</Text>
        </View>

        {items.map((item) => (
          <View key={item.id} style={tableRowStyle}>
            <Text style={columnStyle(3)}>{item.description}</Text>
            <Text style={columnStyle(1)}>{item.quantity}</Text>
            <Text style={columnStyle(1)}>
              {currency}
              {item.unitPrice.toFixed(2)}
            </Text>
            <Text style={columnStyle(1)}>
              {currency}
              {item.total.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={totalsStyle}>
        <View style={totalRowStyle}>
          <Text style={totalLabelStyle}>Subtotal</Text>
          <Text style={totalValueStyle}>
            {currency}
            {subtotal.toFixed(2)}
          </Text>
        </View>

        {tax !== undefined && tax > 0 && (
          <View style={totalRowStyle}>
            <Text style={totalLabelStyle}>Tax</Text>
            <Text style={totalValueStyle}>
              {currency}
              {tax.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={grandTotalStyle}>
          <Text style={grandTotalLabelStyle}>Total</Text>
          <Text style={grandTotalValueStyle}>
            {currency}
            {total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Notes */}
      {notes && (
        <View style={sectionStyle}>
          <Text style={sectionTitleStyle}>Notes</Text>
          <Text style={notesStyle}>{notes}</Text>
        </View>
      )}
    </ScrollView>
  )
}

Invoice.displayName = 'Invoice'
