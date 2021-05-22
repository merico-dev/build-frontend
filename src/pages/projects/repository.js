import React, { useEffect, useMemo } from 'react'
import styled from '@emotion/styled'
import {
  Button,
  makeStyles,
  Link as MuiLink,
  Card,
  CardContent,
  Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'

import { FETCH_PROJECT_PROFILE } from '@/store/reducers/projectProfile'
import Panel from '@/layouts/Panel'
import ErrorBoundary from '@/components/ErrorBoundary'
import HelpText from '@/components/HelpText'
import PageTitle from '@/components/Page/PageTitle'
import PageSubtitle from '@/components/Page/PageSubtitle'
import Ranking from '@/components/Ranking/Ranking'
import CustomChartLegend from '@/components/CustomChartLegend/CustomChartLegend'
import LineWithBars from '@/components/LineWithBars/LineWithBars'
import CustomBarChart from '@/components/CustomBarChart/CustomBarChart'
import { StyledGrid, StyledGridItem } from '@/components/StyledGrid/StyledGrid'
import { getUserByProjectUrl } from '@/utils/repositories/projectUrl'
import { useContributorProfileRouter } from '@/utils/contributor/routeHelper'

const StyledRepository = styled.div`
  max-width: 1240px;
  width: 100%;
  margin: 40px auto 0;
  padding: 0 15px;
`

const StyledExplanationText = styled.div`
  color: var(--color-gray-500);
  font-size: var(--text-xl);
  margin-bottom: 20px;
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop};`}
`

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const StyledCustomBarChartWrapper = styled.div`
  overflow: hidden;
  margin-top: auto;
`

const StyledCustomBarChart = styled(CustomBarChart)`
  margin-top: auto;
`

const StyledPopulationWrapper = styled.div`
  margin-top: 40px;
`

const StyledMergesWrapper = styled.div`
  height: 100%;
  display: flex;
`

const useStyles = makeStyles({
  button: {
    fontSize: 'var(--text-md)',
    minWidth: '180px'
  },
  cardBottom: {
    marginTop: 'auto',
    width: '100%',
    minHeight: '362px'
  }
})

const localTime = DateTime.local()
const startDate = localTime.minus({ years: 100 }).toISO()
const endDate = localTime.endOf('day').toISO()

function RepositoryLinks (props) {
  const {
    url,
    repoName = ''
  } = props

  if (!url?.length) {
    return null
  }

  const repoUser = getUserByProjectUrl(url)

  return (
    <>
      <MuiLink href={repoUser.url} target='_blank'>
        {repoUser.user}
      </MuiLink> /&nbsp;
      <MuiLink href={url} target='_blank'>{repoName}</MuiLink>
    </>
  )
}

function Repository () {
  const classes = useStyles()
  const {
    gitUrl = ''
  } = queryString.parse(window?.location?.search)
  const {
    user: {
      data: userData = {}
    },
    projectProfile: {
      status: projectProfileStatus,
      data: projectProfileData = {}
    }
  } = useSelector((state) => state)
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
    dispatch({ type: FETCH_PROJECT_PROFILE, payload })
  }, [gitUrl, dispatch])

  const incrementalElocData = useMemo(() => {
    if (
      !Array.isArray(projectProfileData.velocity) ||
      !projectProfileData.velocity.length
    ) {
      return []
    }

    return projectProfileData.velocity.map((velocityItem) => {
      return {
        ...velocityItem,
        name: velocityItem.date
      }
    })
  }, [projectProfileData])

  const mergeData = useMemo(() => {
    if (
      !Array.isArray(projectProfileData.merges) ||
      !projectProfileData.merges.length
    ) {
      return []
    }

    return projectProfileData.merges.map((mergeItem) => {
      return {
        date: mergeItem.date,
        merges: mergeItem.merged,
        name: mergeItem.date
      }
    })
  }, [projectProfileData])

  return (
    <StyledRepository>
      <PageTitle>Project Profile</PageTitle>
      <StyledExplanationText>
        Merico Build is a community management tool for maintainers of
        projects with many contributors.
        It provides objective engineering metrics to cultivate relationships
        with developers and funders.
      </StyledExplanationText>
      <StyledButtonContainer>
        <Button
          color='primary'
          variant='contained'
          size='large'
          className={classes.button}
          component={Link}
          to='/'
        >
          Learn More
        </Button>
      </StyledButtonContainer>
      <PageTitle>
        <RepositoryLinks
          url={projectProfileData?.webUrl}
          repoName={projectProfileData?.name}
        />
      </PageTitle>
      <PageSubtitle>Top Contributors</PageSubtitle>
      <Ranking
        gitUrl={gitUrl}
        startDate={startDate}
        endDate={endDate}
        height='493px'
        userData={userData}
        onContributorClick={ViewContributorProfile}
        rows={
          projectProfileData.topContributors
        }
      />
      <StyledPopulationWrapper>
        <PageSubtitle>Population</PageSubtitle>
        <HelpText>
          What is the growth of the contributor population in this repository?
        </HelpText>
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
              data={projectProfileData.population || []}
              status={projectProfileStatus}
              gitUrls={[projectProfileData.gitUrl]}
              title='Number of Contributors'
              valueKey='contributors'
              featured
            />
          </CardContent>
        </Card>
      </StyledPopulationWrapper>
      <StyledGrid marginTop={40}>
        <StyledGridItem>
          <PageSubtitle>Repository ELOC</PageSubtitle>
          <HelpText>
            What is the amount of code all contributors in the repository have written?<br />
            To learn more about how ELOC works:&nbsp;
            <MuiLink href='https://playground.mericobuild.com' target='_blank'>
              <strong>Explore ELOC Playground</strong>
            </MuiLink>
          </HelpText>
          <Card className={classes.cardBottom}>
            <CardContent>
              <Typography variant='h3' className={classes.chartTitle}>Incremental ELOC</Typography>
              <StyledCustomBarChartWrapper>
                <StyledCustomBarChart
                  isFetching={projectProfileStatus !== 'SUCCEED'}
                  data={incrementalElocData}
                  height={290}
                  interval={projectProfileData?.interval}
                  valueKey='elocs'
                  dateFormat='ISO'
                />
              </StyledCustomBarChartWrapper>
            </CardContent>
          </Card>
        </StyledGridItem>
        <StyledGridItem>
          <PageSubtitle>Merges</PageSubtitle>
          <HelpText>
            How many PR/MRs have been merged in this repository?
          </HelpText>
          <StyledMergesWrapper>
            <Card className={classes.cardBottom}>
              <CardContent>
                <Typography variant='h3' className={classes.chartTitle}>Number of PR/MR Merges</Typography>
                <StyledCustomBarChartWrapper>
                  <StyledCustomBarChart
                    isFetching={projectProfileStatus !== 'SUCCEED'}
                    data={mergeData}
                    height={290}
                    interval={projectProfileData?.interval}
                    valueKey='merges'
                    dateFormat='ISO'
                  />
                </StyledCustomBarChartWrapper>
              </CardContent>
            </Card>
          </StyledMergesWrapper>
        </StyledGridItem>
      </StyledGrid>
      <StyledExplanationText marginTop='40px'>
        To select other repositories and to compare
        repositories and contributors, sign in with GitHub or GitLab.
      </StyledExplanationText>
      <StyledButtonContainer>
        <Button
          color='primary'
          variant='contained'
          size='large'
          className={classes.button}
          component={Link}
          to='/'
        >
          Sign up
        </Button>
      </StyledButtonContainer>
    </StyledRepository>
  )
}

export default function BoundedRepository () {
  return (
    <Panel
      sidebar={false}
      isAuthenticated={false}
      topbarProps={{ isPublic: false }}
    >
      <ErrorBoundary>
        <Repository />
      </ErrorBoundary>
    </Panel>
  )
}
