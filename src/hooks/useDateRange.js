import { useCallback, useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'

import {
  defaultToSessionFilters,
  getSessionFilters,
  setSessionFilters
} from '@/utils/sessionFilters'

const dateFilters = getSessionFilters() || {}

export default function useDateRange (props) {
  const {
    onRangeChange,
    hasInitialDates
  } = props

  const thisMonth = useMemo(() => {
    const currentTime = DateTime.local()

    return {
      from: currentTime.minus({ years: 100 }).toISO(),
      to: currentTime.endOf('day').toISO()
    }
  }, [])

  const [startDate, setStartDate] = useState(
    dateFilters.startDate || thisMonth.from
  )
  const [endDate, setEndDate] = useState(
    dateFilters.endDate || thisMonth.to
  )

  useEffect(() => {
    // do not default to session filter if we have initial dates set
    if (!hasInitialDates) {
      defaultToSessionFilters(
        null,
        setStartDate,
        setEndDate
      )
    }
  }, [hasInitialDates])

  useEffect(() => {
    if (startDate && endDate) {
      onRangeChange({
        startDate,
        endDate
      })
    }
  }, [
    onRangeChange,
    startDate,
    endDate
  ])

  // TODO: better handle the range times
  const changeCustomDates = useCallback(({ to, from }) => {
    const startDate = DateTime.fromISO(from).startOf('day').toISO()
    let endDate
    setStartDate(startDate)
    if (to) {
      endDate = DateTime.fromISO(to).endOf('day').toISO()
    } else {
      endDate = DateTime.fromISO(from).endOf('day').toISO()
    }
    setEndDate(endDate)
    setSessionFilters(
      'custom',
      startDate,
      endDate
    )
  }, [setStartDate, setEndDate])

  return {
    startDate,
    endDate,
    changeCustomDates
  }
}
