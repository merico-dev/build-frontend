import { DateTime } from 'luxon'

export function isAllTime (startDate, endDate) {
  if (!startDate?.length || !endDate?.length) {
    return false
  }

  const startDateISO = DateTime.fromISO(startDate)
  const endDateISO = DateTime.fromISO(endDate)

  const moreThan70YearsDiff = startDateISO.diff(endDateISO, 'years').years < -70

  return moreThan70YearsDiff
}
