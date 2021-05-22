import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react'
import {
  Card,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton
} from '@material-ui/core'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import { ReactComponent as Plus } from '@/icons/plus.svg'
import { ReactComponent as InfoCircle } from '@/icons/info-circle.svg'

import {
  SAVE_REPOSITORIES,
  FETCH_DEV_VALUE_BY_TEAM,
  FETCH_DEV_VALUE_BY_TEAM_RANKING,
  FETCH_PRODUCTIVITY_OVERVIEW,
  FETCH_IMPACT_OVERVIEW,
  FETCH_QUALITY_OVERVIEW
} from '@/store/reducers/dashboard'
import { SUCCEED } from '@/store/statusTypes'
import HelpPopover from '@/components/HelpPopover'
import MultipleRepositoriesFilter from '@/components/MultipleRepositoriesFilter'
import SelectRepositoriesDialog from '@/components/SelectRepositoriesDialog'
import DevValueRanking from '@/components/DevValueRanking'
import FetchStatus from '@/components/FetchStatus'
import useAllTimeFallback from '@/utils/useAllTimeFallback'
import MultipleLineChart from '@/components/MultipleLineChart'
import { lgMedia, mdMedia, smMedia } from '@/styles/snippets/responsive'
import { getDefaultFavoriteRepositories, themeRepositories } from '@/utils/repositories'
import QualityMixedGraph from '@/components/QualityMixedGraph'
import { ellipsis } from '@/utils/string'

const StyledRepositorySelectorButton = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: var(--color-primary-400);
  cursor: pointer;
  margin: 22px 0 0 20px;
`

const StyledUnavailableFeaturesWarning = styled.div`
  margin-top: 10px;
  color: var(--color-gray-400);
  text-align: center;
`

const StyledInfoCircle = styled(InfoCircle)`
  color: var(--color-background-orange);
  margin-right: 6px;
  transform: translateY(5px);
`

const StyledChartsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 11px;
  ${lgMedia(`
    grid-template-columns: repeat(2, 1fr);
  `)}
`

const StyledFilter = styled.div`
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  position: sticky;
  margin-top: 60px;
  top: 60px;
  z-index: 6;
  left: 0;
  padding: 19px 20px;
  justify-content: center;
  ${smMedia(`
    justify-content: flex-start;
  `)}
  ${mdMedia('padding: 19px 50px;')}
`

const StyledDevShareSummary = styled.div`
  margin: 0 20px;
  ${mdMedia('margin: 0 50px;')}
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

export default function DevShareSummary (props) {
  const {
    repositories,
  } = props

  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const {
    dashboard: {
      devValueByTeam,
      devValueByTeamRanking,
      productivityOverview,
      impactOverview,
      qualityOverview
    }
  } = useSelector((state) => state)
  const [favoriteRepositories, setFavoriteRepositories] = useState([])
  const [selectRepositoryOpen, setSelectRepositoryOpen] = useState(false)
  const QualityGraphRef = useRef(null)
  const [qualityData, setQualityData] = useState([])
  const [redraw, setRedraw] = useState(false)
  const {
    setFilters,
    filters,
    defaultRange
  } = useAllTimeFallback({ overview: devValueByTeam })

  useEffect(() => {
    setFavoriteRepositories(getDefaultFavoriteRepositories(repositories))
  }, [repositories])

  const gitUrls = useMemo(() => {
    return favoriteRepositories.map(({ gitUrl }) => gitUrl)
  }, [favoriteRepositories])

  useEffect(() => {
    if (!Object.keys(filters).length) { return }

    const payload = {
      ...filters,
      repositories: gitUrls
    }

    dispatch({ type: FETCH_DEV_VALUE_BY_TEAM, payload })
    dispatch({ type: FETCH_DEV_VALUE_BY_TEAM_RANKING, payload })
    dispatch({ type: FETCH_PRODUCTIVITY_OVERVIEW, payload })
    dispatch({ type: FETCH_IMPACT_OVERVIEW, payload })
    dispatch({ type: FETCH_QUALITY_OVERVIEW, payload })
  }, [dispatch, filters, gitUrls])

  const onRepositoriesSelected = useCallback(
    (updatedRepositories) => {
      dispatch({
        type: SAVE_REPOSITORIES,
        payload: {
          projects: updatedRepositories
        }
      })
      setFavoriteRepositories(
        themeRepositories(
          updatedRepositories.filter(({ isFavorite }) => isFavorite)
        )
      )
    }, [dispatch, setFavoriteRepositories]
  )

  const handleSelectRepositoryClose = () => {
    setSelectRepositoryOpen(false)
  }
  const onFilterChange = useCallback((updatedFilters) => {
    setFilters(updatedFilters)
  }, [setFilters])

  useEffect(() => {
    if (qualityOverview.status === SUCCEED) {
      const qData = qualityOverview.data.map((dataPoint) => {
        const name = ellipsis(dataPoint.repository.name, 15)
        const qualityScore = isNaN(dataPoint.dataSet[0]?.quality)
          ? 0
          : Math.max(0, Number(dataPoint.dataSet[0]?.quality.toFixed(2)))

        return {
          ...dataPoint.dataSet[0],
          name: name,
          quality: qualityScore,
          repository: dataPoint.repository
        }
      })
      setQualityData(qData)
    }
  }, [qualityOverview])

  useEffect(() => {
    const resizeHandler = () => {
      setRedraw(drawing => !drawing)
    }
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
      setRedraw(false)
    }
  }, [QualityGraphRef])

  return (
    <>
      <StyledFilter>
        <MultipleRepositoriesFilter
          onFilterChange={onFilterChange}
          favoriteRepositories={favoriteRepositories}
          defaultRange={defaultRange}
          repositories={repositories}
        />
        <StyledRepositorySelectorButton
          variant='contained'
          onClick={() => setSelectRepositoryOpen(true)}
          size='medium'
          color='default'
          data-test='add-favorite-repositories'
        >
          <Plus width='14' height='15' />
        </StyledRepositorySelectorButton>
      </StyledFilter>
      <SelectRepositoriesDialog
        open={selectRepositoryOpen}
        handleClose={handleSelectRepositoryClose}
        repositories={repositories}
        onRepositoriesSelected={onRepositoriesSelected}
        title='Dev Share Preference'
        subtitle='Select up to six repositories to compare:'
      />
      <StyledDevShareSummary>
        <Typography
          variant='h2'
          className={classes.h2}
        >
          Dev Share&nbsp;&nbsp;
          <HelpPopover
            content='The percentage of total value contributed by a single developer.'
            moreLink='/help#impact'
          >
            <QuestionCircle
              width='28'
              height='28'
            />
          </HelpPopover>
        </Typography>
        <Card className={classes.card}>
          <MultipleLineChart
            data={devValueByTeam?.data || []}
            status={devValueByTeam.status}
            gitUrls={gitUrls}
            repositories={favoriteRepositories}
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
        {
          isSmUp
            ? (
              <>
                <Card className={classes.card}>
                  {
                  devValueByTeamRanking.status === SUCCEED
                    ? (
                      <DevValueRanking
                        filters={filters}
                        repositories={devValueByTeamRanking?.data?.map((devValueByTeamRankingItem) => {
                          return {
                            ...devValueByTeamRankingItem,
                            color: favoriteRepositories?.find(({ gitUrl }) => {
                              return gitUrl === devValueByTeamRankingItem.gitUrl
                            })?.color
                          }
                        })}
                      />
                      )
                    : (
                      <FetchStatus
                        status={devValueByTeamRanking.status}
                        minHeight={372}
                      />
                      )
                }
                </Card>
              </>
              )
            : (
              <StyledUnavailableFeaturesWarning>
                <Typography variant='body2'>
                  <StyledInfoCircle width='20' height='20' />
                  Some features are only available on desktop version.
                </Typography>
              </StyledUnavailableFeaturesWarning>
              )
        }

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
            <MultipleLineChart
              data={productivityOverview?.data || []}
              status={productivityOverview.status}
              gitUrls={gitUrls}
              repositories={favoriteRepositories}
              title='Productivity'
              help={{
                text: 'Productivity measures the amount of work performed.',
                link: '/help#productivity'
              }}
              yAxis={{
                label: {
                  title: 'ELOC',
                  helpText: 'ELOC measures the impact of code using its location in the function call graph.',
                  helpLink: '/help#eloc'
                }
              }}
              nextGenTooltip={false}
            />
          </Card>
          <Card className={classes.card}>
            <MultipleLineChart
              data={impactOverview?.data || []}
              status={impactOverview.status}
              gitUrls={gitUrls}
              repositories={favoriteRepositories}
              title='Impact'
              percentage
              help={{
                text: 'Impact is a measure of how important code is. It leverages the location of code in the function call graph.',
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
            <Typography
              variant='h3'
              className={classes.h3}
              style={{ marginBottom: '30px' }}
            >
              Quality
              {
                qualityData && (
                  <HelpPopover
                    content={
                    `Quality scores are a weighted blend of issue density,
                     doc coverage, test coverage, reusability, and modularity.`
                    }
                    moreLink='/help#quality'
                  >
                    <IconButton
                      size='small'
                      style={{ marginLeft: '7.5px' }}
                      aria-label='More information'
                    >
                      <QuestionCircle width='17.5' hight='17.5' />
                    </IconButton>
                  </HelpPopover>
                )
              }
            </Typography>
            {qualityOverview.status && (
              <div ref={QualityGraphRef}>
                <QualityMixedGraph
                  isFetching={qualityOverview.status !== SUCCEED}
                  data={qualityData}
                  width={QualityGraphRef && QualityGraphRef.current ? QualityGraphRef.current.clientWidth : 320}
                  showDetailsButton
                  redraw={redraw}
                />
              </div>
            )}
          </Card>
        </StyledChartsWrapper>
      </StyledDevShareSummary>
    </>
  )
}
