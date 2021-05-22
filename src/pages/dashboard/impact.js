import React, { useCallback } from 'react'
import { Helmet } from 'react-helmet'
import {
  Typography,
  Card,
  CardContent,
  IconButton
} from '@material-ui/core'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import DetailsContent from '@/components/DetailsContent'
import CommitImpact from '@/components/CommitImpact'
import HelpPopover from '@/components/HelpPopover'
import DetailsHeading from '@/components/DetailsHeading'
import SingleLineChart from '@/components/SingleLineChart'

import { FETCH_OVERVIEW, FETCH_RANKING, FETCH_COMMITS } from '@/store/reducers/impact'
import AsyncSimpleRanking from '@/components/AsyncSimpleRanking'
import useAllTimeFallback from '@/utils/useAllTimeFallback'
import ErrorBoundary from '@/components/ErrorBoundary'
import { shouldShowVariation } from '@/utils/chart/variation'

const StyledRankingLink = styled(Link)`
  float: right;
  text-decoration: none;
  font-size: var(--text-xs);
  color: var(--color-brand-500);
`
export function Impact () {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    overview,
    ranking
  } = useSelector((state) => state.impact)
  const {
    setFilters,
    filters,
    defaultRange
  } = useAllTimeFallback({ overview })

  const handleFilterChange = useCallback((payload) => {
    setFilters(payload)
    dispatch({ type: FETCH_OVERVIEW, payload })
    dispatch({ type: FETCH_COMMITS, payload })
    dispatch({ type: FETCH_RANKING, payload })
  }, [dispatch, setFilters])

  const rankingRoute = useCallback(() => {
    let route = null
    if (filters && filters.gitUrl && filters.startDate && filters.endDate) {
      route = {
        pathname: '/my-contributions/ranking',
        search: `?start=${filters.startDate}&end=${filters.endDate}&sort=impact&gitUrl=${filters?.gitUrl}`,
        state: {
          referrer: '/dashboard/impact'
        }
      }
    }
    return route
  }, [filters])

  const goToFullRanking = (event) => {
    history.push(rankingRoute())
  }

  return (
    <DetailsContent onFilterChange={handleFilterChange} defaultRange={defaultRange}>
      <Helmet>
        <title>Impact Details - Merico Build</title>
      </Helmet>
      <DetailsHeading>
        <Typography variant='h1'>
          Impact&nbsp;
        </Typography>
        <HelpPopover
          content='Impact is a measure of how important code is. It leverages the location of code in the function call graph.'
          moreLink='/help#impact'
        >
          <IconButton
            size='small'
            aria-label='More information'
          >
            <QuestionCircle width='28' hight='28' />
          </IconButton>
        </HelpPopover>
      </DetailsHeading>
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <SingleLineChart
            data={overview?.data || []}
            status={overview.status}
            gitUrls={[filters?.gitUrl]}
            title='Overview'
            yAxis={{
              label: {
                title: 'Proportion of work (%)',
                helpText: 'Impact is measured by estimating the importance of functions.',
                helpLink: '/help#impact',
              }
            }}
            valueKey='value'
            yDomain={[0, 100]}
            featured
            showVariation={shouldShowVariation(filters?.range)}
            percentage
          />
        </CardContent>
      </Card>
      <Typography variant='h2'>Commits</Typography>
      <Card component='article'>
        <CardContent>
          <CommitImpact filters={filters} />
        </CardContent>
      </Card>
      <Typography variant='h2'>Ranking</Typography>
      <Card component='article'>
        <CardContent>
          <AsyncSimpleRanking
            title='Impact'
            contextLink={<StyledRankingLink to={rankingRoute()}>View Full Ranking</StyledRankingLink>}
            data={ranking?.data}
            status={ranking.status}
            // filters={filters}
            // rankSortBy='impact'
            onSeriesClick={goToFullRanking}
          />
        </CardContent>
      </Card>
    </DetailsContent>
  )
}

export default function BoundedImpact () {
  return (
    <ErrorBoundary style={{ padding: '50px' }}>
      <Impact />
    </ErrorBoundary>
  )
}
