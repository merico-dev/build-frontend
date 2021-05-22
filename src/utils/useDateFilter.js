/**
 * ==================================================
 * DEPRECATED: Please, do not use this on new pages
 * ==================================================
 */
import { useState, useEffect, useCallback } from 'react'
import { DateTime } from 'luxon'
import { defaultToSessionFilters, getSessionFilters, setSessionFilters } from '@/utils/sessionFilters'

const dateFilters = getSessionFilters() || {}

/**
 * DEPRECATED: Please, do not use this on new pages
 * React hook to help using date and repositories filters
 * @param {Function} props.onFilterChange a function to be called every time the filter is updated
 * @param {Object} props.repository optional repository to send along with the dates
 * @param {Array} props.repositories optional repositories to send along with the dates
 */
export default function useDateFilter (props) {
  const {
    onFilterChange,
    repositories,
    defaultRange
  } = props
  const [repository, setSelectedRepository] = useState(null)
  const [range, setRange] = useState(dateFilters.range || 'month')
  const currentTime = DateTime.local()
  const [startDate, setStartDate] = useState(
    dateFilters.startDate || currentTime.minus({ months: 1 }).toISO()
  )
  const [endDate, setEndDate] = useState(
    dateFilters.endDate || currentTime.plus({ days: 2 }).toISO()
  )

  const setRepository = useCallback((repository) => {
    if (localStorage) {
      try {
        localStorage.setItem('selectedRepository', JSON.stringify(repository))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Unable to save repository', e, repository)
      }
    }
    setSelectedRepository(repository)
  }, [setSelectedRepository])

  useEffect(() => {
    defaultToSessionFilters(
      setRange,
      setStartDate,
      setEndDate
    )
  }, [])

  useEffect(() => {
    if (Array.isArray(repositories)) {
      onFilterChange({
        startDate,
        endDate,
        repositories: repositories.map(({ gitUrl }) => gitUrl),
        range
      })
      return
    }
    // only load data if a repository is selected
    if (repository) {
      onFilterChange({
        startDate,
        endDate,
        gitUrl: repository?.value,
        range
      })
    }
  }, [
    onFilterChange,
    startDate,
    endDate,
    repository,
    repositories,
    range
  ])

  const handleRangeChange = useCallback((range, isUserInteraction) => {
    const handleRangeLocalTime = DateTime.local()
    const futureDate = handleRangeLocalTime.plus({ days: 2 }).toISO()
    let startDate

    switch (range) {
      case 'month': {
        startDate = handleRangeLocalTime.minus({ months: 1 }).toISO()
        break
      }
      case 'quarter': {
        startDate = handleRangeLocalTime.minus({ months: 3 }).toISO()
        break
      }
      case 'all':
      default: {
        startDate = handleRangeLocalTime.minus({ years: 100 }).toISO()
        setEndDate(futureDate)
        break
      }
    }

    setStartDate(startDate)
    setEndDate(futureDate)
    setRange(range)

    // we only save to session when it's an interaction
    if (isUserInteraction) {
      setSessionFilters(
        range,
        startDate,
        futureDate
      )
    }
  }, [
    setRange,
    setStartDate,
    setEndDate
  ])

  useEffect(() => {
    if (defaultRange) {
      handleRangeChange(defaultRange)
    }
  }, [defaultRange, handleRangeChange])

  // TODO: better handle the range times
  const onDateChanged = ({ to, from }) => {
    if (range !== 'custom') return
    const startDate = DateTime.fromJSDate(from).set({ hours: 0, minutes: 0 }).toISO()
    let endDate
    setStartDate(startDate)
    if (to) {
      endDate = DateTime.fromJSDate(to).set({ hours: 23, minutes: 59, seconds: 59 }).toISO()
    } else {
      endDate = DateTime.fromJSDate(from).set({ hours: 23, minutes: 59, seconds: 59 }).toISO()
    }
    setEndDate(endDate)
    setSessionFilters(
      'custom',
      startDate,
      endDate
    )
  }

  return {
    handleRangeChange,
    range,
    onDateChanged,
    repository,
    setRepository,
    startDate,
    endDate
  }
}
