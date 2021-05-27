export function setSessionFilters (range, startDate, endDate) {
  try {
    sessionStorage.setItem('dateFilters', JSON.stringify({
      range,
      startDate,
      endDate
    }))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Unable to save date filters', e)
  }
}

export function clearSessionFilters () {
  sessionStorage.removeItem('dateFilters')
}

export function getSessionFilters () {
  try {
    return JSON.parse(sessionStorage?.getItem('dateFilters'))
  } catch (e) {
    return null
  }
}

export function defaultToSessionFilters (
  setRange,
  setStartDate,
  setEndDate
) {
  const dateFilters = getSessionFilters()
  if (dateFilters) {
    try {
      if (dateFilters.range && setRange) {
        setRange(dateFilters.range)
      }
      if (dateFilters.startDate) {
        setStartDate(dateFilters.startDate)
      }
      if (dateFilters.endDate) {
        setEndDate(dateFilters.endDate)
      }
      return true
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to use local date filter', e)
      return false
    }
  }

  return false
}
