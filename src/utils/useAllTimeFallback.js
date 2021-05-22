import { useEffect, useState } from 'react'

import { SUCCEED } from '@/store/statusTypes'

export default function useAllTimeFallback ({ overview }) {
  const [filters, setFilters] = useState({})
  const [defaultRange, setDefaultRange] = useState(false)
  const [shouldFallback, setShouldFallback] = useState(true)

  useEffect(() => {
    if (
      // check if we should try to fallback
      shouldFallback &&
      // overview loaded correctly
      overview.status === SUCCEED &&
      // there is no data to show
      !overview.data.length &&
      // the filter is not all time already
      filters.range !== 'all' &&
      // current filter is not custom
      filters.range !== 'custom'
    ) {
      setShouldFallback(false)
      setDefaultRange('all')
      return
    }

    if (
      // overview loaded correctly
      overview.status === SUCCEED &&
      shouldFallback === false
    ) {
      setShouldFallback(false)
    }
  }, [overview, filters, setShouldFallback, shouldFallback])

  return {
    filters,
    setFilters,
    defaultRange
  }
}
