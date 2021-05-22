import { DateTime } from 'luxon'

export default function defaultTickFormatter (interval, value, format = 'M/dd/yy') {
  if (!value) {
    return null
  }

  const date = (format === 'ISO')
    ? DateTime.fromISO(value)
    : DateTime.fromFormat(value, format)

  switch (interval) {
    case 'quarter':
      return date.toFormat('Qq yy')
    case 'month':
      return date.toFormat('MMM yyyy')
    case 'year':
      return date.toFormat('yyyy')
    case 'custom':
      return value
    default:
      return date.toLocaleString({
        day: '2-digit',
        year: '2-digit',
        month: '2-digit'
      })
  }
}

export function getTitleByInterval (label, interval = 'day', format = 'M/dd/yy') {
  if (!label) {
    return ''
  }

  const date = (format === 'ISO')
    ? DateTime.fromISO(label)
    : DateTime.fromFormat(label, format)

  if (!date.isValid) {
    return label
  }

  switch (interval) {
    case 'quarter':
      return date.toFormat('Qq. yyyy')
    case 'year':
      return date.toFormat('yyyy')
    case 'month':
      return date.toFormat('LLL. yyyy')
    default:
      return date.toFormat('LLL dd. yyyy')
  }
}
