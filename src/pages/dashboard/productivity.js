import React, { useCallback } from 'react'
import { Helmet } from 'react-helmet'
import {
  Card,
  CardContent,
  Typography,
  IconButton
} from '@material-ui/core'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'

import {
  FETCH_OVERVIEW,
  FETCH_VELOCITY,
  FETCH_RANKING
} from '@/store/reducers/productivity'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import DetailsContent from '@/components/DetailsContent'
import DetailsHeading from '@/components/DetailsHeading'
import HelpPopover from '@/components/HelpPopover'
import AsyncSimpleRanking from '@/components/AsyncSimpleRanking'
import { mdMedia } from '@/styles/snippets/responsive'
import useAllTimeFallback from '@/utils/useAllTimeFallback'
import ErrorBoundary from '@/components/ErrorBoundary'
import SingleLineChart from '@/components/SingleLineChart'
import { shouldShowVariation } from '@/utils/chart/variation'

const StyledAboveFoldCharts = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;
  grid-gap: 20px;

  ${mdMedia('grid-template-columns: repeat(2, 1fr);')}
`

const StyledRankingLink = styled(Link)`
  float: right;
  text-decoration: none;
  font-size: var(--text-xs);
  color: var(--color-brand-500);
`

export function Productivity () {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    productivity: {
      overview,
      velocity,
      ranking
    }
  } = useSelector((state) => state)
  const {
    setFilters,
    filters,
    defaultRange
  } = useAllTimeFallback({ overview })

  const handleFilterChange = useCallback((payload) => {
    setFilters(payload)
    dispatch({
      type: FETCH_OVERVIEW,
      payload
    })
    dispatch({
      type: FETCH_VELOCITY,
      payload
    })
    dispatch({
      type: FETCH_RANKING,
      payload
    })
  }, [dispatch, setFilters])

  const rankingRoute = useCallback(() => {
    let route = null
    if (filters && filters.gitUrl && filters.startDate && filters.endDate) {
      route = {
        pathname: '/my-contributions/ranking',
        search: `?start=${filters.startDate}&end=${filters.endDate}&sort=productivity&gitUrl=${filters?.gitUrl}`,
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
    <>
      <DetailsContent onFilterChange={handleFilterChange} defaultRange={defaultRange}>
        <Helmet>
          <title>Productivity Details - Merico Build</title>
        </Helmet>
        <DetailsHeading>
          <Typography variant='h1'>
            Productivity&nbsp;
          </Typography>
          <HelpPopover
            content='Productivity measures the amount of work performed.'
            moreLink='/help#productivity'
          >
            <IconButton
              size='small'
              aria-label='More information'
            >
              <QuestionCircle width='28' hight='28' />
            </IconButton>
          </HelpPopover>
        </DetailsHeading>
        <StyledAboveFoldCharts>
          <Card>
            <CardContent>
              <SingleLineChart
                title='Velocity'
                data={velocity?.data || []}
                status={velocity.status}
                gitUrls={[filters?.gitUrl]}
                yAxis={{
                  label: {
                    title: 'ELOC',
                    helpText: `
                      ELOC is a relatively accurate estimate of the development effort.
                      It is computed from the edit operations on the
                      abstract syntax trees (ASTs) during the development process.
                      Compared to counting lines of code or the number of commits,
                      it contains less noise, such as line breaks or commit sizes.
                    `,
                    helpLink: '/help#eloc',
                  }
                }}
                valueKey='value'
                featured
                variant='md'
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <SingleLineChart
                title='Progress'
                data={overview?.data || []}
                status={overview.status}
                gitUrls={[filters?.gitUrl]}
                yAxis={{
                  label: {
                    title: 'ELOC',
                    helpText: 'Total amount of code produced over time, measured in ELOC.',
                    helpLink: '/help#eloc',
                  }
                }}
                valueKey='value'
                featured
                showVariation={shouldShowVariation(filters?.range)}
                variant='md'
              />
            </CardContent>
          </Card>
        </StyledAboveFoldCharts>
        <Typography variant='h2'>Ranking</Typography>
        <Card component='article'>
          <CardContent>
            <AsyncSimpleRanking
              title='Productivity'
              contextLink={<StyledRankingLink to={rankingRoute()}>View Full Ranking</StyledRankingLink>}
              data={{
                data: ranking?.data,
                contributors: ranking?.contributors
              }}
              status={ranking.status}
              // filters={filters}
              // rankSortBy='productivity'
              onSeriesClick={goToFullRanking}
            />
          </CardContent>
        </Card>
      </DetailsContent>
    </>
  )
}

export default function BoundedProductivity () {
  return (
    <ErrorBoundary style={{ padding: '50px' }}>
      <Productivity />
    </ErrorBoundary>
  )
}
