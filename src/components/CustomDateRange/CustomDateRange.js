import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import { ReactComponent as CalendarFilled } from '@/icons/calendar-filled.svg'
import DateControl from '@/components/DateControl/DateControl'
import useDateRange from '@/hooks/useDateRange'
import { DateTime } from 'luxon'

const StyledDateInput = styled.div`
  background-color: #fff;
  padding: 0 8px;
  height: 28px;
  color: var(--color-gray-400);
  border: solid 1px var(--color-primary-400);
  display: flex;
  align-items: center;
  width: 250px;
  justify-content: space-between;
  border-radius: 2px;
`

const StyledCalendarFilled = styled(CalendarFilled)`
  color: var(--color-primary-400);
`

const StyledDateText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const StyledDateIcon = styled.div`
  width: 12.5px;
`

function CustomDateRageDisplay (props) {
  const {
    startDate,
    endDate
  } = props

  const startDateISO = DateTime.fromISO(startDate)
  const endDateISO = DateTime.fromISO(endDate)

  const startDateFormated = DateTime.fromISO(startDateISO).toLocaleString({
    day: '2-digit',
    year: 'numeric',
    month: '2-digit'
  })
  const endDateFormated = DateTime.fromISO(endDateISO).toLocaleString({
    day: '2-digit',
    year: 'numeric',
    month: '2-digit'
  })

  const moreThan70YearsDiff = startDateISO.diff(endDateISO, 'years').years < -70

  return (
    <StyledDateText>
      {
        moreThan70YearsDiff
          ? ('All Time')
          : (
          `${startDateFormated} - ${endDateFormated}`
            )
      }
    </StyledDateText>
  )
}

export default function CustomDateRange (props) {
  const {
    onRangeChange,
    initialRange = null,
    initialStartDate,
    initialEndDate
  } = props

  const {
    startDate,
    endDate,
    changeCustomDates
  } = useDateRange({
    onRangeChange,
    hasInitialDates: initialStartDate?.length && initialEndDate?.length
  })

  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      changeCustomDates({
        from: initialStartDate,
        to: initialEndDate
      })
    }
  }, [initialStartDate, initialEndDate, changeCustomDates])

  const [calendarIsOpen, setCalendarIsOpen] = useState(false)
  const anchorRef = useRef()

  const openCalendar = () => {
    setCalendarIsOpen(true)
  }

  return (
    <>
      <StyledDateInput onClick={openCalendar} ref={anchorRef} data-test='date-input-selector'>
        <CustomDateRageDisplay startDate={startDate} endDate={endDate} />
        <StyledDateIcon>
          <StyledCalendarFilled width='12.5' height='12.5' />
        </StyledDateIcon>
      </StyledDateInput>
      <DateControl
        anchorRef={anchorRef}
        open={calendarIsOpen}
        setOpen={setCalendarIsOpen}
        onDateChanged={changeCustomDates}
        initialRange={initialRange}
        initialStartDate={startDate && DateTime.fromISO(startDate).toJSDate()}
        initialEndDate={endDate && DateTime.fromISO(endDate).toJSDate()}
      />
    </>
  )
}
