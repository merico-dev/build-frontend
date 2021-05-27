import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, CardContent, makeStyles, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'

import PageSubtitle from '@/components/Page/subtitle'
import HelpText from '@/components/HelpText'
import CustomBarChart from '@/components/CustomBarChart/CustomBarChart'
import { StyledGrid, StyledGridItem } from '@/components/StyledGrid/StyledGrid'
// import SingleLineChart from '@/components/SingleLineChart'
import { mdMedia, smMedia } from '@/styles/snippets/responsive'
import Ranking, { getRankingItem } from '@/components/Ranking/Ranking'
import PageFilter from '@/components/PageFilter/PageFilter'
import LineWithBars from '@/components/LineWithBars/LineWithBars'
import { FETCH_DASHBOARD_OVERVIEW } from '@/store/reducers/dashboardOverview'
import { getUserAlias } from '@/utils/user/user'
import CustomChartLegend from '@/components/CustomChartLegend/CustomChartLegend'
import { useContributorProfileRouter } from '@/utils/contributor/routeHelper'

const useStyles = makeStyles((theme) => ({
  chartTitle: {
    marginBottom: '27px'
  },
  intro: {
    margin: 0
  },
  cardBottom: {
    marginTop: 'auto',
    width: '100%',
    minHeight: '383px'
  },
  publicProfileButton: {
    alignSelf: 'center',
    marginTop: '25px',
    [theme.breakpoints.up('sm')]: {
      marginTop: '0'
    }
  }
}))

const StyledPageWrapper = styled.div`
  padding: 20px;
  ${mdMedia('padding: 40px 50px;')}
`

const StyledIntro = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-direction: column;

  ${smMedia(`
    flex-direction: row;
  `)}
`

const StyledCustomBarChart = styled(CustomBarChart)`
  margin-top: auto;
`

const StyledCustomBarChartWrapper = styled.div`
  overflow: hidden;
  margin-top: auto;
`

const StyledButtonWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
`

const getSlicedRanking = (userData, data = [], sortModelField) => {
  const sortedData = data.sort((a, b) => b.productivity - a.productivity)

  const userIndex = sortedData.findIndex(({ gitUsername }) => {
    return [
      userData.gitlabUsername,
      userData.githubUsername
    ].includes(gitUsername)
  })

  if (data[userIndex]) {
    data[userIndex].selected = true
    data[userIndex].isSelected = true
  }
  let initialIndex = 0
  let finalIndex = 5
  // sets index to 0 if user is top 3
  if (userIndex >= 3) {
    initialIndex = userIndex - 2
    finalIndex = userIndex + 3
  }

  if (userIndex > data.length - 3) {
    initialIndex = data.length - 5
    finalIndex = data.length
  }

  return data.slice(initialIndex, finalIndex).map(
    (rank, idx) => getRankingItem(rank, idx, sortModelField)
  )
}

export default function DashboardOverview (props) {
  // const history = useHistory()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [gitUrl, setGitUrl] = useState([])
  const {
    user: {
      data: userData = {}
    },
    dashboardOverview: {
      overview: {
        status: dashboardOverviewStatus,
        data: dashboardOverviewData = {}
      }
    }
  } = useSelector((state) => state)
  const classes = useStyles()
  const dispatch = useDispatch()

  const ViewContributorProfile = useContributorProfileRouter(startDate, endDate, gitUrl)

  useEffect(() => {
    if (!startDate?.length && !endDate?.length && !gitUrl?.length) {
      return
    }

    const payload = {
      startDate,
      endDate,
      gitUrl
    }
    dispatch({ type: FETCH_DASHBOARD_OVERVIEW, payload })
  }, [startDate, endDate, gitUrl, dispatch])

  const onFilterChange = useCallback((startDate, endDate, repository) => {
    if (startDate) {
      setStartDate(startDate)
    }
    if (endDate) {
      setEndDate(endDate)
    }
    setGitUrl(repository?.value)
  }, [])

  const incrementalElocData = useMemo(() => {
    if (
      !Array.isArray(dashboardOverviewData.velocity) ||
      !dashboardOverviewData.velocity.length
    ) {
      return []
    }

    return dashboardOverviewData.velocity.map((velocityItem) => {
      return {
        ...velocityItem,
        name: velocityItem.date
      }
    })
  }, [dashboardOverviewData])

  const mergeData = useMemo(() => {
    if (
      !Array.isArray(dashboardOverviewData.merges) ||
      !dashboardOverviewData.merges.length
    ) {
      return []
    }

    return dashboardOverviewData.merges.map((mergeItem) => {
      return {
        ...mergeItem,
        name: mergeItem.date
      }
    })
  }, [dashboardOverviewData])

  const PublicProfileRoute = (name = 'Contributor', email = 'nobody@merico.dev') => {
    return {
      pathname: `/contributor/profile/?email=${encodeURIComponent(email)}`,
      state: {
        gitUrl: gitUrl,
        start: startDate,
        end: endDate,
        contributorEmail: email,
        contributorName: name
      }
    }
  }

  return (
    <StyledPageWrapper>
      <StyledIntro>
        <Typography
          variant='h2'
          className={classes.intro}
        >
          Good morning, {getUserAlias(userData)}!
        </Typography>
        <Button
          color='primary'
          variant='contained'
          component={Link}
          to={PublicProfileRoute(userData?.displayName, userData?.primaryEmail)}
          className={classes.publicProfileButton}
          data-test='view-public-profile-button'
        >View Public User Profile
        </Button>
      </StyledIntro>
      <PageFilter
        onFilterChange={onFilterChange}
      />
      <div>
        <PageSubtitle>Ranking</PageSubtitle>
        <Ranking
          gitUrl={gitUrl}
          startDate={startDate}
          endDate={endDate}
          height='493px'
          hideFooterPagination
          userData={userData}
          onContributorClick={ViewContributorProfile}
          rows={
            getSlicedRanking(
              userData,
              dashboardOverviewData.ranking
            )
          }
        />
        <StyledButtonWrapper>
          <Button
            color='primary'
            variant='contained'
            component={Link}
            to={{
              pathname: '/dashboard/ranking',
              state: {
                referrer: '/dashboard/overview'
              }
            }}
          >View Full Ranking
          </Button>
        </StyledButtonWrapper>
      </div>
      <PageSubtitle>Population</PageSubtitle>
      <HelpText>What is the growth of the contributor population in this repository?</HelpText>
      <Card>
        <CardContent>
          <Typography variant='h3' className={classes.chartTitle}>Number of Contributors</Typography>
          <CustomChartLegend
            data={[
              { type: 'line', label: 'Total Contributors' },
              { type: 'Bar', label: 'Increments' }
            ]}
          />
          <LineWithBars
            data={dashboardOverviewData.population || []}
            status={dashboardOverviewStatus}
            gitUrls={[dashboardOverviewData.gitUrl]}
            title='Number of Contributors'
            valueKey='contributors'
            interval={dashboardOverviewData.interval}
            featured
          />
        </CardContent>
      </Card>
      <StyledGrid marginTop={40}>
        <StyledGridItem>
          <PageSubtitle>Merges</PageSubtitle>
          <HelpText>How many PR/MRs have been merged in this repository?</HelpText>
          <Card className={classes.cardBottom}>
            <CardContent>
              <Typography variant='h3' className={classes.chartTitle}>Number of PR/MR Merges</Typography>
              <StyledCustomBarChartWrapper>
                <StyledCustomBarChart
                  isFetching={dashboardOverviewStatus !== 'SUCCEED'}
                  data={mergeData}
                  height={290}
                  interval={dashboardOverviewData?.interval}
                  valueKey='merged'
                  dateFormat='ISO'
                />
              </StyledCustomBarChartWrapper>
            </CardContent>
          </Card>
        </StyledGridItem>
        <StyledGridItem>
          <PageSubtitle>Repository ELOC</PageSubtitle>
          <HelpText>What is the amount of code all contributors in the repository have written?</HelpText>
          <Card className={classes.cardBottom}>
            <CardContent>
              <Typography variant='h3' className={classes.chartTitle}>Incremental ELOC</Typography>
              <StyledCustomBarChartWrapper>
                <StyledCustomBarChart
                  isFetching={dashboardOverviewStatus !== 'SUCCEED'}
                  data={incrementalElocData}
                  height={290}
                  interval={dashboardOverviewData?.interval}
                  valueKey='elocs'
                  dateFormat='ISO'
                />
              </StyledCustomBarChartWrapper>
            </CardContent>
          </Card>
        </StyledGridItem>
      </StyledGrid>
      <StyledButtonWrapper>
        <Button
          color='primary'
          variant='contained'
          component={Link}
          to='/projects/repositories'
          data-test='view-repositories-button'
        >View Details
        </Button>
      </StyledButtonWrapper>
    </StyledPageWrapper>
  )
}
