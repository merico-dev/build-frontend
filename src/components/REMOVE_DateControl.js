import React, { useState } from 'react'
import styled from '@emotion/styled'
import {
  Popper,
  ClickAwayListener,
  IconButton,
  withStyles
} from '@material-ui/core'
import 'react-dates/lib/css/_datepicker.css'
import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { DateTime } from 'luxon'

import { ReactComponent as Arrow } from '@/icons/arrow.svg'
import { ReactComponent as Reload } from '@/icons/reload.svg'
import { ReactComponent as Check } from '@/icons/check.svg'
import calendarBackground from '@/images/calendar-background.svg'
import calendarBackgroundRevert from '@/images/calendar-background-revert.svg'

import FilterSelect from '@/components/FilterSelect'

// eslint-disable-next-line react/jsx-props-no-spreading
const StyledArrow = styled(({ nextArrow, ...rest }) => <Arrow {...rest} />)`
  transform: ${({ nextArrow }) => (nextArrow ? 'rotate(-90deg)' : 'rotate(90deg)')};
  color: var(--color-primary-500);
`

const StyledContainer = styled.div`
  display: flex;
  ${({ centered }) => (centered ? 'justify-content: center;' : '')};
  background-color: #FFF3EB;
  padding: ${({ padding }) => (padding ?? '20px')};
`

const StyledIconButton = withStyles({
  root: {
    background: 'var(--color-primary-400)',
    color: '#fff',
    boxShadow: 'var(--elevation-1)',
    margin: '0 15px',
    width: '28px',
    height: '28px',
    padding: 0,
    '&:hover': {
      background: 'var(--color-primary-400)',
      boxShadow: 'var(--elevation-1)',
    }
  }
})(IconButton)

const StyledFilterSelect = styled(FilterSelect)`
  width: 70px;
  z-index: 3;
`

function Navbar ({
  onPreviousClick,
  onNextClick
}) {
  const styleLeft = {
    position: 'absolute',
    left: '10px',
    top: '11px',
    pointerEvents: 'all'
  }
  const styleRight = {
    position: 'absolute',
    right: '10px',
    top: '11px',
    pointerEvents: 'all'
  }
  return (
    <div style={{ position: 'absolute', width: '100%', pointerEvents: 'none' }}>
      <span style={styleLeft}>
        <IconButton onClick={() => onPreviousClick()}>
          <StyledArrow width='10' height='8' />
        </IconButton>
      </span>
      <span style={styleRight}>
        <IconButton onClick={() => onNextClick()}>
          <StyledArrow width='10' height='8' nextArrow />
        </IconButton>
      </span>
    </div>
  )
}

const StyledDayPicker = styled(DayPicker)`
  &.Customized {
    background: #FFF3EB;
    width: 100%;
    .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
      color: #fff;
      position: relative;
      background: url(${calendarBackground});
      background-size: 67px 21px;
      background-repeat: no-repeat;
      background-position: -1px -1px;

      &.DayPicker-Day--end {
        background-image: url(${calendarBackgroundRevert});
        background-position: -36px -1px;
      }
    }
    .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
      background: var(--color-primary-100);
    }
    &.DayPicker:not(.DayPicker--interactionDisabled)
      .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
      background-color: var(--color-primary-100);
    }
    .DayPicker-Day {
      border-radius: 0 !important;
      font-size: 0.6875rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 18px;
      color: var(--color-gray-400);

      &:focus {
        outline: 0;
      }
    }
    .DayPicker-Day--disabled {
      pointer-events: none !important;
      opacity: 0.4;
    }

    /* layout */
    .DayPicker-Caption {
      display: block;
      font-size: 1rem;
      color: var(--color-gray-400);
      text-align: right;
      padding-right: 53px;
    }
    .DayPicker-Month {
      display: block;
      width: 220px;
    }
    .DayPicker-Month:first-of-type {
      .DayPicker-Caption {
        text-align: left;
        padding-right: 0;
        padding-left: 55px;

      }
    }
    .DayPicker-Weekdays {
      display: block;
    }
    .DayPicker-WeekdaysRow,
    .DayPicker-Week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    .DayPicker-WeekdaysRow {
      text-transform: uppercase;
      font-size: 0.6875rem;
      color: var(--color-gray-300);
    }
    .DayPicker-Week {
      margin-bottom: 8px;
    }
    .DayPicker-Body {
      display: block;
    }
    .DayPicker-wrapper {
      padding-bottom: 10px;

      &:focus {
        outline: 0;
      }
    }

    /* nav */
    .DayPicker-NavBar {
      position: relative;
    }
    .DayPicker-NavButton--prev {
      position: absolute;
      left: 1em;
    }
  }
`

const StyledCalendarWrapper = styled.div`
  border-radius: 4px;
  overflow: hidden;
`

const getYearList = (start) => {
  const yearList = []

  for (let i = 0; i <= 10; i++) {
    const year = start - i
    yearList.push({ value: year, label: year })
  }

  return yearList
}

const yearList = getYearList(
  new Date().getFullYear()
)

/**
 * DEPRECATED: Not remove for compatibility - DO NOT USE
 */
export default function DateControl (props) {
  const {
    anchorRef,
    open,
    setOpen,
    onDateChanged,
    defaultStartDate,
    defaultEndDate
  } = props

  const [to, setTo] = useState(defaultEndDate)
  const [from, setFrom] = useState(defaultStartDate)
  const [startDate, setStartDate] = useState(null)
  const [year, setYear] = useState(yearList[0])

  const changeYear = (option) => {
    setYear(option)

    let date = null
    if (from) {
      date = DateTime.fromJSDate(from).set({ year: option.value }).toJSDate()
    } else {
      date = DateTime.fromFormat(`${option.value}-02-01`, 'yyyy-dd-MM').toJSDate()
    }

    setStartDate(date)
  }
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }
  const handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, { to, from })
    setTo(range.to)
    setFrom(range.from)
  }
  const onReset = () => {
    setFrom(null)
    setTo(null)
  }

  const onSubmit = () => {
    onDateChanged({ to, from })
    setOpen(false)
  }

  return (
    <Popper
      open={open}
      anchorEl={anchorRef.current}
      placement='bottom-end'
      role={undefined}
      style={{ zIndex: 4 }}
      disablePortal
    >
      <StyledCalendarWrapper>
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <StyledContainer padding='20px 20px 0 20px'>
              <StyledFilterSelect
                setValue={changeYear}
                defaultValue={year}
                value={year}
                options={yearList}
                customStyles={{
                  control: { backgroundColor: '#FFF3EB' }
                }}
              />
            </StyledContainer>
            <StyledDayPicker
              className='Customized'
              numberOfMonths={2}
              selectedDays={[from, { from, to }]}
              onDayClick={handleDayClick}
              month={startDate}
              modifiers={{ start: from, end: to }}
              navbarElement={<Navbar />}
              disabledDays={[{ after: new Date() }]}
              onMonthChange={(date) => {
                const fullYear = date.getFullYear()
                const yearOption = { value: fullYear, label: fullYear }
                if (year.value !== fullYear) {
                  changeYear(yearOption)
                }
              }}
            />
            <StyledContainer centered padding='0 20px 20px 20px'>
              <StyledIconButton color='primary' onClick={onReset}><Reload width='14' height='14' /></StyledIconButton>
              <StyledIconButton color='primary' onClick={onSubmit}><Check width='14' height='11' /></StyledIconButton>
            </StyledContainer>
          </div>
        </ClickAwayListener>
      </StyledCalendarWrapper>
    </Popper>
  )
}
