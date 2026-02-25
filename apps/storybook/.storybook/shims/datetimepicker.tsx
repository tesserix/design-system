import React from 'react'

type DateTimePickerEvent = {
  type: 'set' | 'dismissed'
}

type DateTimePickerProps = {
  value: Date
  onChange?: (event: DateTimePickerEvent, date?: Date) => void
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange }) => {
  React.useEffect(() => {
    onChange?.({ type: 'set' }, value)
  }, [onChange, value])

  return null
}

export default DateTimePicker
