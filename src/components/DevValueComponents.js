import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  FormControlLabel,
  Radio,
  useTheme,
  useMediaQuery,
  Card,
  withStyles,
  Button
} from '@material-ui/core'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useDateFilter from '@/utils/useDateFilter'
import { ReactComponent as Calendar } from '@/icons/calendar.svg'
import { lgMedia, smMedia } from '@/styles/snippets/responsive'
import StyledRadioGroup from '@/components/StyledRadioGroup'
import StyledCalendarWrapper from '@/components/StyledCalendarWrapper'
import DateControl from '@/components/REMOVE_DateControl'
import FilterSelect from '@/components/FilterSelect'
import { getOptionsFromArray } from '@/utils/select/select'
import MetricGraph from '@/components/MetricGraph'
import {
  FETCH_OVERVIEW as FETCH_QUALITY_OVERVIEW
} from '@/store/reducers/quality'
import {
  FETCH_OVERVIEW as FETCH_IMPACT_OVERVIEW
} from '@/store/reducers/impact'
import {
  FETCH_OVERVIEW as FETCH_PRODUCTIVITY_OVERVIEW
} from '@/store/reducers/productivity'
import useAllTimeFallback from '@/utils/useAllTimeFallback'
import useRepositories from '@/utils/DEPRECATED_useRepositories'
import { humanPercentage } from '@/utils/numbers'
import { Readiness } from '@/enums/repositoryReadiness'
import { shouldShowVariation } from '@/utils/chart/variation'

const StyledChartsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 11px;
  ${lgMedia(`
    grid-template-columns: repeat(3, 1fr);
  `)}
`

const StyledFiltersWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledFilterRepository = styled.div`
  display: flex;
`

const StyledFilterRepositoryLabel = styled.div`
  font-weight: bold;
  font-size: var(--text-md);
  color: var(--color-gray-400);
  margin-right: 10px;

  ${smMedia(`
    font-size: var(--text-xl);
    display: flex;
    align-items: center;
  `)}
`

const StyledCard = withStyles({
  root: {
    padding: '20px',
    minHeight: '485.5px',
    display: 'flex',
    flexDirection: 'column'
  }
})(Card)

const StyledButton = withStyles({
  root: {
    marginTop: '20px'
  }
})(Button)

export default function DevValueComponents (props) {
  const {
    userData
  } = props
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const [open, setOpen] = useState(false)
  const {
    quality: {
      overview: qualityOverview
    },
    impact: {
      overview: impactOverview
    },
    productivity: {
      overview: productivityOverview
    }
  } = useSelector((state) => state)

  const {
    setFilters,
    filters,
    defaultRange
  } = useAllTimeFallback({ overview: impactOverview })

  useEffect(() => {
    if (filters) {
      dispatch({ type: FETCH_QUALITY_OVERVIEW, payload: filters })
      dispatch({ type: FETCH_IMPACT_OVERVIEW, payload: filters })
      dispatch({ type: FETCH_PRODUCTIVITY_OVERVIEW, payload: filters })
    }
  }, [dispatch, filters])
  const onFilterChange = useCallback(
    (filters) => setFilters(filters),
    [setFilters]
  )
  const {
    handleRangeChange,
    range,
    onDateChanged,
    repository,
    setRepository,
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
  const anchorRef = useRef()
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
    handleRangeChange('custom')
  }

  const openCalendar = () => {
    setOpen(true)
  }

  return (
    <div>
      <StyledFiltersWrapper>
        <StyledFilterRepository>
          <StyledFilterRepositoryLabel>
            Repository
          </StyledFilterRepositoryLabel>
          <FilterSelect
            width={isSmUp ? 240 : 185}
            value={repository}
            setValue={setRepository}
            options={getOptionsFromArray(list?.data, 'gitUrl', 'name', (item) => (
              item.status === Readiness.UNDERWAY &&
              !item.lastSyncTime
            ))}
          />
        </StyledFilterRepository>
        {
          !isMdDown
            ? (
              <>
                <StyledRadioGroup
                  aria-label='range'
                  name='range'
                  value={range}
                  onChange={({ target }) => handleRangeChange(target.value)}
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
                <DateControl
                  anchorRef={anchorRef}
                  open={open}
                  setOpen={setOpen}
                  onDateChanged={onDateChanged}
                />
              </>
              )
            : null
        }
      </StyledFiltersWrapper>
      <StyledChartsWrapper>
        <StyledCard>
          <MetricGraph
            title='Impact'
            helpContent='Impact is a measure of how important code is. It leverages the location of code in the function call graph.'
            helpLink='/help'
            yLabel={{
              title: 'Dev Share (%)',
              help: `
                The percentage of total value contributed by a single developer,
                including both impact (Dev Rank) and productivity (ELOC).
              `,
              more: '/help'
            }}
            status={impactOverview.status}
            data={impactOverview?.data?.map((item) => ({
              ...item,
              value: humanPercentage(item.value, 2)
            }))}
            height='300px'
            showVariation={shouldShowVariation(filters?.range)}
            yMax={100}
            featured
          />
          <StyledButton
            fullWidth
            color='primary'
            variant='contained'
            to='/dashboard/impact'
            component={Link}
          >
            View Details
          </StyledButton>
        </StyledCard>
        <StyledCard>
          <MetricGraph
            title='Productivity'
            helpContent='Productivity measures the amount of work performed.'
            helpLink='/help'
            yLabel={{
              title: 'ELOC',
              help: 'ELOC measures the impact of code using its location in the function call graph.',
              more: '/help'
            }}
            status={productivityOverview.status}
            data={productivityOverview?.data}
            height='300px'
            showVariation={shouldShowVariation(filters?.range)}
            featured
          />
          <StyledButton
            fullWidth
            color='primary'
            variant='contained'
            to='/dashboard/productivity'
            component={Link}
          >
            View Details
          </StyledButton>
        </StyledCard>
        <StyledCard>
          <MetricGraph
            title='Quality'
            helpContent='Quality scores are a weighted blend of issue density, doc coverage, test coverage, reusability, and modularity.'
            helpLink='/help'
            yLabel={{
              title: 'Overall Score (%)'
            }}
            status={qualityOverview.status}
            data={qualityOverview?.data?.map((item) => ({
              ...item,
              quality: Number(item.quality.toFixed(2))
            }))}
            height='300px'
            showVariation={shouldShowVariation(filters?.range)}
            featured
            xAxis={{
              key: 'create_time'
            }}
            yAxis={{
              key: 'quality'
            }}
            yMax={100}
          />
          <StyledButton
            fullWidth
            color='primary'
            variant='contained'
            to='/dashboard/quality'
            component={Link}
          >
            View Details
          </StyledButton>
        </StyledCard>
      </StyledChartsWrapper>
    </div>
  )
}
