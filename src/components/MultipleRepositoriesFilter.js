import React, { useRef, useState } from 'react'
import {
  FormControlLabel,
  makeStyles,
  Radio
} from '@material-ui/core'
import styled from '@emotion/styled'
import { getColorGenerator } from 'charts'

import StyledRadioGroup from '@/components/StyledRadioGroup'
import useDateFilter from '@/utils/useDateFilter'
import StyledCalendarWrapper from '@/components/StyledCalendarWrapper'
import DateControl from '@/components/REMOVE_DateControl'
import Legend from '@/components/Legend'

import { ReactComponent as Calendar } from '@/icons/calendar.svg'
import { colorSet } from '@/enums/colors'

const StyledLegendWrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const StyledRange = styled.div`
  width: 100%;
`

const useStyles = makeStyles((theme) => ({
  range: {
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start'
    }
  }
}))

export default function MultipleRepositoriesFilter (props) {
  const {
    onFilterChange,
    defaultRange,
    favoriteRepositories = [],
    repositories = []
  } = props
  const classes = useStyles()
  const colors = getColorGenerator(null, colorSet)
  const anchorRef = useRef()
  const [open, setOpen] = useState(false)
  const {
    handleRangeChange,
    range,
    onDateChanged
  } = useDateFilter({
    repositories: favoriteRepositories,
    onFilterChange,
    defaultRange
  })

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
    handleRangeChange('custom')
  }

  const openCalendar = () => {
    setOpen(true)
  }

  const repositoriesLabels = favoriteRepositories.length ? favoriteRepositories : repositories

  return (
    <>
      <StyledRange>
        <DateControl
          anchorRef={anchorRef}
          open={open}
          setOpen={setOpen}
          onDateChanged={onDateChanged}
        />
        <StyledRadioGroup
          aria-label='range'
          name='range'
          value={range}
          onChange={(e) => handleRangeChange(e.target.value, e)}
          className={classes.range}
        >
          <FormControlLabel
            labelPlacement='end'
            value='all'
            control={<Radio color='primary' />}
            label='All Time'
          />
          <FormControlLabel
            labelPlacement='end'
            value='month'
            control={<Radio color='primary' />}
            label='Last Month'
          />
          <FormControlLabel
            labelPlacement='end'
            value='quarter'
            control={<Radio color='primary' />}
            label='Last Quarter'
          />
          <FormControlLabel
            labelPlacement='end'
            value='custom'
            control={<Radio color='primary' />}
            label='Custom'
            onChange={() => (null)}
            onClick={(e) => {
              e.preventDefault()
              openCalendar()
              handleRangeChange('custom')
            }}
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
      </StyledRange>
      <StyledLegendWrapper data-test='repository-labels'>
        <Legend
          data={repositoriesLabels.map(
            (repository) => ({
              name: repository.name,
              color: repository.color || colors.next().value,
              noCommits: repository.userCommitCount < 1,
              url: `/repository/overview?gitUrl=${repository.gitUrl}`
            })
          )}
        />
      </StyledLegendWrapper>
    </>
  )
}
