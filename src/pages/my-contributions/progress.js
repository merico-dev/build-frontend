import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import HelpText from '@/components/HelpText'
import {
  Card,
  CardContent,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as ExclamationCircle } from '@/icons/exclamation-circle.svg'
import ErrorBoundary from '@/components/ErrorBoundary'
import PageTitle from '@/components/Page/title'
import PageSubtitle from '@/components/Page/subtitle'
import SingleLineChart from '@/components/SingleLineChart'
import CustomBarChart from '@/components/CustomBarChart/CustomBarChart'
import { lgMedia, mdMedia } from '@/styles/snippets/responsive'
import useRepositories from '@/hooks/useRepositories'
import CustomDateRange from '@/components/CustomDateRange/CustomDateRange'
import FilterSelect from '@/components/FilterSelect'
import { Readiness } from '@/enums/repositoryReadiness'
import { getOptionsFromArray } from '@/utils/select/select'
import { FETCH_OVERVIEW as FETCH_IMPACT } from '@/store/reducers/impact'
import { FETCH_MERGE_REQUESTS } from '@/store/reducers/mergeRequests'

import {
  FETCH_OVERVIEW as FETCH_PRODUCTIVITY,
  FETCH_VELOCITY as FETCH_PRODUCTIVITY_VELOCITY
} from '@/store/reducers/productivity'
import CommitImpact from '@/components/CommitImpact'
import { SUCCEED } from '@/store/statusTypes'
import HelpPopover from '@/components/HelpPopover'

const useStyles = makeStyles({
  exploreLink: {
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  chartTitle: {
    marginBottom: '26px',
    lineHeight: 1,
    minHeight: '28px'
  },
  helpIcon: {
    color: 'var(--color-gray-200)',
    marginLeft: '7.5px',
    transform: 'translateY(-2px)'
  },
  fullHeightCard: {
    marginTop: 'auto',
    '& .MuiCardContent-root': {
      display: 'flex',
      flexDirection: 'column'
    }
  }
})

const StyledExploreWrapper = styled.p`
  text-align: right;
  margin: 0 0 20px;
`

const StyledGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  margin: 0 -7px 0;
  ${({ marginBottom }) => marginBottom && `margin-bottom: ${marginBottom}px;`}

  ${lgMedia(`
    grid-template-columns: 1fr 1fr;
  `)}
`

const StyledProgressPage = styled.div`
  padding: 20px;
  ${mdMedia(`
    padding: 50px;
  `)}
`

const StyledCustomBarChart = styled(CustomBarChart)`
  margin-top: auto;
`

const StyledCustomBarChartWrapper = styled.div`
  overflow: hidden;
  margin-top: auto;
  min-height: 285px;
`

const StyledProgressFilters = styled.div`
  display: flex;
  margin: 20px 0;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;

  ${lgMedia(`
    align-items: center;
    flex-direction: row;
  `)}
`

const StyledProgressFiltersLabel = styled.div`
  color: var(--color-gray-400);
  margin: 10px 10px 5px 0;

  ${lgMedia(`
    align-items: center;
    flex-direction: row;
    margin: 0 10px 0 20px;
  `)}

  ${
    ({ noMarginLeft }) => {
      return noMarginLeft && lgMedia('margin-left: 0;')
    }
  }
`

const StyledGridItem = styled.div`
  display: flex;
  flex-direction: column;
  /* this is needed in order to make responsive bar chart work */
  overflow: hidden;
  padding: 7px;
`

function ProgressPage () {
  const classes = useStyles()
  const [gitUrl, setGitUrl] = useState()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [repositoryOptions, setRepositoryOptions] = useState([])
  const dispatch = useDispatch()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const {
    user: {
      data: userData = {}
    },
    productivity: {
      overview: productivityOverview,
      velocity: productivityVelocity
    },
    impact: {
      overview: impactOverview
    },
    mergeRequests
  } = useSelector(state => state)
  const {
    list,
    repository,
    setRepository
  } = useRepositories()
  const rangeChanged = useCallback((newDates) => {
    if (!newDates?.startDate?.length || !newDates?.endDate?.length) {
      return
    }

    setStartDate(newDates.startDate)
    setEndDate(newDates.endDate)
  }, [])

  const filters = useMemo(() => ({ startDate, endDate, gitUrl }), [startDate, endDate, gitUrl])

  useEffect(() => {
    if (repository?.value) {
      setGitUrl(repository.value)
    }
  }, [repository])

  useEffect(() => {
    setRepositoryOptions(list.data.map((repo) => {
      return { ...repo, fullName: repo.gitUrl ? `${repo.gitUrl?.split('/').reverse()[1]} / ${repo.name}` : repo.name }
    }))
  }, [list.data])

  useEffect(() => {
    if (filters.startDate && filters.endDate && filters.gitUrl) {
      dispatch({ type: FETCH_PRODUCTIVITY, payload: filters })
      dispatch({ type: FETCH_PRODUCTIVITY_VELOCITY, payload: filters })
      dispatch({ type: FETCH_IMPACT, payload: filters })
      if (userData?.id) {
        dispatch({
          type: FETCH_MERGE_REQUESTS,
          payload: {
            ...filters,
            userId: userData?.id
          }
        })
      }
    }
  }, [dispatch, filters, userData])

  const incrementalElocData = useMemo(() => {
    if (!Array.isArray(productivityVelocity?.data)) {
      return []
    }

    return productivityVelocity.data.map((velocityItem) => {
      return {
        ...velocityItem,
        name: velocityItem.date
      }
    })
  }, [productivityVelocity.data])

  const mergesData = useMemo(() => {
    if (!Array.isArray(mergeRequests?.data)) {
      return []
    }

    return mergeRequests.data.map((mergeItem) => {
      return {
        ...mergeItem,
        name: mergeItem.date
      }
    })
  }, [mergeRequests.data])

  return (
    <StyledProgressPage>
      <PageTitle>My Contribution - Progress</PageTitle>
      <StyledProgressFilters>
        <StyledProgressFiltersLabel noMarginLeft>Repository</StyledProgressFiltersLabel>
        <FilterSelect
          // width={isSmUp ? 240 : 185}
          value={repository}
          setValue={setRepository}
          options={getOptionsFromArray(repositoryOptions, 'gitUrl', 'fullName', (item) => (
            item.status === Readiness.UNDERWAY &&
                !item.lastSyncTime
          ))}
        />
        <StyledProgressFiltersLabel>Time Range</StyledProgressFiltersLabel>
        <CustomDateRange
          onRangeChange={rangeChanged}
        />
      </StyledProgressFilters>
      <PageSubtitle>ELOC</PageSubtitle>

      <StyledGrid marginBottom='40'>
        <StyledGridItem>
          <HelpText link='/help#eloc' newLineLink={false}>What is the amount of code I have written?</HelpText>
          <Card>
            <CardContent>
              <SingleLineChart
                data={productivityOverview?.data || []}
                status={productivityOverview.status}
                gitUrls={[gitUrl]}
                title='Total ELOC'
                valueKey='value'
                interval={productivityOverview.interval}
                help={{
                  text: `The amount of code a contributor has written,
                  measured in ELOC, a similar but less noisey metric than LOC`,
                  link: '/help#eloc'
                }}
                featured
              />
            </CardContent>
          </Card>
        </StyledGridItem>
        <StyledGridItem overflowHidden>
          <StyledExploreWrapper>
            <Typography color='primary' component='a' href='https://playground.mericobuild.com' className={classes.exploreLink}>
              Explore ELOC Playground
            </Typography>
          </StyledExploreWrapper>
          <Card className={classes.fullHeightCard}>
            <CardContent>
              <Typography variant='h3' className={classes.chartTitle}>
                Incremental ELOC
                <HelpPopover
                  content={`The amount of code a contributor has written,
                  measured in ELOC, a similar but less noisey metric than LOC`}
                  moreLink='/help#eloc'
                >
                  <IconButton
                    size='small'
                    aria-label='More information'
                    className={classes.helpIcon}
                  >
                    <ExclamationCircle width='21' hight='21' />
                  </IconButton>
                </HelpPopover>
              </Typography>
              <StyledCustomBarChartWrapper>
                <StyledCustomBarChart
                  isFetching={productivityVelocity.status !== SUCCEED}
                  data={incrementalElocData}
                  height={285}
                  gitUrls={[gitUrl]}
                  interval={productivityVelocity?.interval}
                  dateFormat='ISO'
                />
              </StyledCustomBarChartWrapper>
            </CardContent>
          </Card>
        </StyledGridItem>
      </StyledGrid>
      <StyledGrid marginBottom='40'>
        <StyledGridItem>
          <PageSubtitle>Impact</PageSubtitle>
          <HelpText link='/help#impact'>How much impact does my code have on other contributors’ code?</HelpText>
          <Card>
            <CardContent>
              <SingleLineChart
                data={impactOverview?.data || []}
                status={impactOverview.status}
                gitUrls={[gitUrl]}
                title='Impact'
                valueKey='value'
                yDomain={[0, 100]}
                interval={impactOverview?.interval}
                featured
                help={{
                  text: `The amount of impact a contributor’s code has on other contributors’
                  code in this repository`,
                  link: '/help#impact'
                }}
                percentage
              />
            </CardContent>
          </Card>
        </StyledGridItem>
        <StyledGridItem overflowHidden>
          <PageSubtitle>Merges</PageSubtitle>
          <HelpText link='/help#merges'>How many of my PR/MRs have been merged?</HelpText>
          <Card className={classes.fullHeightCard}>
            <CardContent>
              <Typography
                variant='h3'
                className={classes.chartTitle}
              >
                Number of PR/MR Merges
              </Typography>
              <StyledCustomBarChartWrapper>
                <StyledCustomBarChart
                  isFetching={
                    mergeRequests.status !== SUCCEED
                  }
                  data={mergesData}
                  height={285}
                  gitUrls={[gitUrl]}
                  valueKey='merged'
                  interval={mergeRequests?.interval}
                  dateFormat='ISO'
                />
              </StyledCustomBarChartWrapper>
            </CardContent>
          </Card>
        </StyledGridItem>
      </StyledGrid>
      <PageSubtitle>Commit Details</PageSubtitle>
      <Card>
        <CardContent>
          <CommitImpact filters={filters} showHeatBar={false} showHelp={false} />
        </CardContent>
      </Card>
    </StyledProgressPage>
  )
}

export default function BoundedProgress () {
  return (
    <ErrorBoundary>
      <ProgressPage />
    </ErrorBoundary>
  )
}
