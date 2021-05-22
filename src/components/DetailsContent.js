import React, { useState, useRef, useMemo } from 'react'
import styled from '@emotion/styled'

import {
  Radio,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  makeStyles
} from '@material-ui/core'
import useDateFilter from '@/utils/useDateFilter'
import { DateTime } from 'luxon'

import { ReactComponent as Calendar } from '@/icons/calendar.svg'
import { mdMedia, mdMediaDown, lgMedia } from '@/styles/snippets/responsive'
import FilterSelect from '@/components/FilterSelect'
import DateControl from '@/components/REMOVE_DateControl'
import StyledRadioGroup from '@/components/StyledRadioGroup'
import StyledCalendarWrapper from '@/components/StyledCalendarWrapper'
import { useSelector } from 'react-redux'
import { SUCCEED } from '@/store/statusTypes'
import { Readiness } from '@/enums/repositoryReadiness'
import useRepositories from '@/utils/DEPRECATED_useRepositories'
import ProviderLink from '@/components/Repositories/ProviderLink'

const StyledDetailsContent = styled.div`
  padding: 77px 20px 50px;

  ${mdMedia(`
    padding: 110px 50px 50px;
  `)}
`

const StyledDetailsRepository = styled.form`
  position: fixed;
  top: 60px;
  background: #fff;
  width: var(--content-width-without-sidebar);
  right: 0;
  min-height: 60px;
  display: flex;
  align-items: center;
  padding: 9px 20px;
  z-index: 4;
  left: 0;
  flex-wrap: wrap;
  justify-content: center;

  ${mdMediaDown(`
    top: 60px !important;
  `)}

  ${mdMedia(`
    left: auto;
    width: var(--content-width-with-sidebar);
    padding: 9px 45px;
  `)}
`

const StyledDateFilter = styled.div`
  margin: 0 auto;
  display: none;
  color: var(--color-gray-400);

  ${lgMedia(`
    margin: 0 0 0 auto;
  `)}

  ${mdMedia(`
    display: block;
  `)}
`

const StyledFilterSelect = styled(FilterSelect)`
  margin-left:10px;
`

const useStyles = makeStyles({
  providerLink: {
    margin: '0 5px 0 10px'
  }
})

const getRepositoryEnabledList = (list) => {
  if (list.status !== SUCCEED) {
    return []
  }

  const repositories = list.data.map((repository) => {
    const firstProcessing = (repository.status === Readiness.UNDERWAY && !repository.lastSyncTime)

    if (
      repository.status !== Readiness.READY &&
      repository.status !== Readiness.UNDERWAY
    ) {
      return null
    }

    return {
      value: repository.gitUrl,
      label: repository.name,
      isDisabled: firstProcessing
    }
  })

  return repositories.filter((repository) => repository)
}

export default function DetailsContent (props) {
  const {
    children,
    onFilterChange,
    defaultRange
  } = props
  const classes = useStyles()
  const {
    user: {
      data: userData
    }
  } = useSelector((state) => state)
  const [open, setOpen] = useState(false)
  const anchorRef = useRef()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))
  const {
    handleRangeChange,
    range,
    onDateChanged,
    repository,
    setRepository,
    startDate,
    endDate
  } = useDateFilter({
    onFilterChange,
    userData,
    defaultRange
  })
  const {
    list
  } = useRepositories({
    setRepository
  })
  const options = useMemo(() => {
    return getRepositoryEnabledList(list)
  }, [list])

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
    handleRangeChange('custom')
  }

  const openCalendar = () => {
    setOpen(true)
  }

  return (
    <StyledDetailsContent>
      <StyledDetailsRepository>
        Repository
        <StyledFilterSelect
          width={matches ? 240 : 360}
          value={repository}
          setValue={setRepository}
          options={options}
        />
        <ProviderLink
          gitUrl={repository?.value}
          repositories={list?.data || []}
          width={24}
          height={24}
          className={classes.providerLink}
        />
        <StyledDateFilter>
          <StyledRadioGroup
            aria-label='range'
            name='range'
            value={range}
            onChange={(e) => handleRangeChange(e.target.value, e)}
          >
            <FormControlLabel
              labelPlacement='end'
              value='all'
              control={<Radio color='primary' />}
              checked={range === 'all'}
              label='All Time'
            />
            <FormControlLabel
              labelPlacement='end'
              value='month'
              control={<Radio color='primary' />}
              checked={range === 'month'}
              label='Last Month'
            />
            <FormControlLabel
              labelPlacement='end'
              value='quarter'
              control={<Radio color='primary' />}
              checked={range === 'quarter'}
              label='Last Quarter'
            />
            <FormControlLabel
              labelPlacement='end'
              value='custom'
              control={<Radio color='primary' />}
              label='Custom'
              onChange={openCalendar}
              onClick={(e) => {
                e.preventDefault()
                openCalendar()
                handleRangeChange('custom', true)
              }}
              checked={range === 'custom'}
              style={{ marginRight: '6px' }}
            />
            <StyledCalendarWrapper
              ref={anchorRef}
            >
              <Calendar
                onClick={handleToggle}
                width='15'
                height='14'
              />
            </StyledCalendarWrapper>
          </StyledRadioGroup>
        </StyledDateFilter>
      </StyledDetailsRepository>
      <DateControl
        anchorRef={anchorRef}
        open={open}
        setOpen={setOpen}
        onDateChanged={onDateChanged}
        defaultStartDate={DateTime.fromISO(startDate).toJSDate()}
        defaultEndDate={DateTime.fromISO(endDate).toJSDate()}
      />
      {children}
    </StyledDetailsContent>
  )
}
