import React, { useCallback } from 'react'
import { Helmet } from 'react-helmet'
import {
  Typography,
  Card,
  IconButton,
  makeStyles
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'

import {
  FETCH_DEV_VALUE_BY_TEAM,
  FETCH_DEV_VALUE_BY_TEAM_RANKING,
  FETCH_PRODUCTIVITY_OVERVIEW,
  FETCH_IMPACT_OVERVIEW,
  FETCH_QUALITY_OVERVIEW
} from '@/store/reducers/dashboard'
import MultipleLineCharts from '@/components/MultipleLineChart'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import DetailsContent from '@/components/DetailsContent'
import HelpPopover from '@/components/HelpPopover'
import DetailsHeading from '@/components/DetailsHeading'

import useAllTimeFallback from '@/utils/useAllTimeFallback'
import { lgMedia } from '@/styles/snippets/responsive'

const StyledChartsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 11px;
  ${lgMedia(`
    grid-template-columns: repeat(2, 1fr);
  `)}
`

const useStyles = makeStyles((theme) => ({
  h2: {
    fontSize: 'var(--text-xxxl)',
    '&:first-of-type': {
      marginTop: '40px'
    }
  },
  card: {
    padding: '18px 10px',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'scroll',
    marginBottom: '20px',
    [theme.breakpoints.up('sm')]: {
      padding: '20px 30px 30px',
      overflow: 'hidden'
    }
  }
}))

export default function RepositoryOverview () {
  const dispatch = useDispatch()
  const classes = useStyles()
  const {
    dashboard: {
      devValueByTeam,
      productivityOverview,
      impactOverview,
      qualityOverview
    }
  } = useSelector((state) => state)
  const {
    setFilters,
    filters,
    defaultRange
  } = useAllTimeFallback({ overview: devValueByTeam })

  const handleFilterChange = useCallback((payload) => {
    setFilters(payload)
    const filters = {
      ...payload,
      repositories: [payload.gitUrl]
    }

    dispatch({ type: FETCH_DEV_VALUE_BY_TEAM, payload: filters })
    dispatch({ type: FETCH_DEV_VALUE_BY_TEAM_RANKING, payload: filters })
    dispatch({ type: FETCH_PRODUCTIVITY_OVERVIEW, payload: filters })
    dispatch({ type: FETCH_IMPACT_OVERVIEW, payload: filters })
    dispatch({ type: FETCH_QUALITY_OVERVIEW, payload: filters })
  }, [dispatch, setFilters])

  return (
    <DetailsContent onFilterChange={handleFilterChange} defaultRange={defaultRange}>
      <Helmet>
        <title>Repository Overview - Merico Build</title>
      </Helmet>
      <DetailsHeading>
        <Typography variant='h1'>
          Dev Share&nbsp;
        </Typography>
        <HelpPopover
          content={`
            The percentage of total value contributed by a single developer.
          `}
          moreLink='/help'
        >
          <IconButton
            size='small'
            aria-label='More information'
          >
            <QuestionCircle width='28' hight='28' />
          </IconButton>
        </HelpPopover>
      </DetailsHeading>
      <Card className={classes.card}>
        <MultipleLineCharts
          data={devValueByTeam?.data || []}
          status={devValueByTeam.status}
          gitUrls={[filters?.gitUrl]}
          title='My Dev Share'
          yAxis={{
            label: {
              title: 'Dev Share (%)'
            }
          }}
          valueKey='dev_value'
          yDomain={[0, 100]}
          tooltipColumns={[
            { name: 'dev_value', title: 'Dev Share', featured: true },
            { name: 'count', title: 'Commits', featured: false },
            { name: 'loc', title: 'LOC', featured: false },
          ]}
          percentage
          nextGenTooltip={false}
        />
      </Card>
      <Typography
        variant='h2'
        id='components-of-dev-value'
        className={classes.h2}
      >
        Components of Dev Share&nbsp;&nbsp;
        <HelpPopover
          content='The facets of performance that have been combined into Dev Share'
        >
          <QuestionCircle width='28' height='28' />
        </HelpPopover>
      </Typography>
      <StyledChartsWrapper>
        <Card className={classes.card}>
          <MultipleLineCharts
            data={productivityOverview?.data || []}
            status={productivityOverview.status}
            gitUrls={[filters?.gitUrl]}
            title='Productivity'
            help={{
              text: 'Productivity measures the amount of work performed.',
              link: '/help#dev-equivalent-and-productivity'
            }}
            yAxis={{
              label: {
                title: 'ELOC',
                helpText: 'ELOC measures the impact of code using its location in the function call graph.',
                helpLink: '/help#dev-equivalent-and-productivity'
              }
            }}
            nextGenTooltip={false}
          />
        </Card>
        <Card className={classes.card}>
          <MultipleLineCharts
            data={impactOverview?.data || []}
            status={impactOverview.status}
            gitUrls={[filters?.gitUrl]}
            title='Impact'
            percentage
            help={{
              text: `
                Impact is a measure of how important code is.
                It leverages the location of code in the function call graph.
              `,
              link: '/help#impact'
            }}
            yAxis={{
              label: {
                title: 'Overall Score (%)',
              }
            }}
            yDomain={[0, 100]}
            nextGenTooltip={false}
          />
        </Card>
        <Card className={classes.card}>
          <MultipleLineCharts
            data={qualityOverview?.data || []}
            status={qualityOverview.status}
            gitUrls={[filters?.gitUrl]}
            title='Quality'
            help={{
              text: `
                Quality scores are a weighted blend of issue density,
                doc coverage, test coverage, reusability, and modularity.
              `,
              link: '/help#quality'
            }}
            yAxis={{
              label: {
                title: 'Overall Score (%)',
              }
            }}
            valueKey='quality'
            yDomain={[0, 100]}
            dateKey='create_time'
            nextGenTooltip={false}
          />
        </Card>
      </StyledChartsWrapper>
    </DetailsContent>
  )
}
