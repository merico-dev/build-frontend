import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import {
  Card,
  CardContent,
  makeStyles,
  Typography
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { Plural } from '@lingui/macro'

import PageFilter from '@/components/PageFilter/PageFilter'
import PageTitle from '@/components/Page/PageTitle'
import PageSubtitle from '@/components/Page/PageSubtitle'
import PageContainer from '@/components/Page/PageContainer'
import HelpText from '@/components/HelpText'
import { lgMedia } from '@/styles/snippets/responsive'
import SingleLineChart from '@/components/SingleLineChart'
import MultipleLineChart from '@/components/MultipleLineChart'
import CustomBarChart from '@/components/CustomBarChart/CustomBarChart'
import CustomMultipleBarChart from '@/components/CustomBarChart/CustomMultipleBarChart'
import QualityComparison from '@/components/Quality/QualityComparison'
import { SUCCEED } from '@/store/statusTypes'
import { FETCH_PROJECTS } from '@/store/reducers/projects'
import CustomChartLegend from '@/components/CustomChartLegend/CustomChartLegend'
import LineWithBars from '@/components/LineWithBars/LineWithBars'
import Panel from '@/layouts/Panel'
import ErrorBoundary from '@/components/ErrorBoundary'

const useStyles = makeStyles({
  exploreLink: {
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  chartTitle: {
    marginBottom: '27px'
  },
  fullHeightCard: {
    height: '100%',
    '& .MuiCardContent-root': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  },
  cardBottom: {
    marginTop: 'auto',
    width: '100%',
    minHeight: '383px'
  }
})

const StyledCustomBarChart = styled(CustomBarChart)`
  margin-top: auto;
`

const StyledCustomMultipleBarChart = styled(CustomMultipleBarChart)`
  margin-top: auto;
`

const StyledCustomBarChartWrapper = styled.div`
  overflow: hidden;
  margin-top: auto;
`

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

const StyledGridItem = styled.div`
  display: flex;
  flex-direction: column;
  /* this is needed in order to make responsive bar chart work */
  overflow: hidden;
  padding: 7px;
`

const StyledIncrementalElocWrapper = styled.div`
  height: 100%;
  display: flex;
`

const IncrementalEloc = (props) => {
  const {
    data,
    status
  } = props

  const incrementalElocData = useMemo(() => {
    if (data.length > 1 || !Array.isArray(data[0]?.velocity)) {
      return []
    }

    const velocity = data[0].velocity

    return velocity.map((velocityItem) => {
      return {
        ...velocityItem,
        name: velocityItem.date
      }
    })
  }, [data])

  return data.length > 1
    ? (
      <MultipleLineChart
        data={data.map(({ repoName, velocity }) => {
          return {
            repository: {
              name: repoName,
            },
            dataSet: velocity
          }
        })}
        status={status}
        gitUrls={[data[0]?.gitUrl]}
        valueKey='elocs'
        featured
        showVariation={false}
        interval={data[0]?.interval}
        dateFormat='ISO'
      />
      )
    : (
      <StyledCustomBarChartWrapper>
        <StyledCustomBarChart
          isFetching={status !== SUCCEED}
          data={incrementalElocData}
          valueKey='elocs'
          interval={data[0]?.interval}
          dateFormat='ISO'
        />
      </StyledCustomBarChartWrapper>
      )
}

const TotalEloc = (props) => {
  const {
    data,
    status
  } = props

  return data.length > 1
    ? (
      <MultipleLineChart
        data={data.map(({ repoName, progress }) => {
          return {
            repository: {
              name: repoName,
            },
            dataSet: progress
          }
        })}
        status={status}
        gitUrls={[data[0]?.gitUrl]}
        title='Total ELOC'
        valueKey='elocs'
        featured
        showVariation={false}
        interval={data[0]?.interval}
      />
      )
    : (
      <SingleLineChart
        data={data[0]?.progress || []}
        status={status}
        gitUrls={[data[0]?.gitUrl]}
        title='Total ELOC'
        valueKey='elocs'
        featured
        showVariation={false}
        interval={data[0]?.interval}
      />
      )
}

const MergeRequests = (props) => {
  const {
    data,
    status
  } = props

  return data.length > 1
    ? (
      <StyledCustomMultipleBarChart
        isFetching={status !== SUCCEED}
        data={data}
        dataSetKey='merges'
        valueKey='merged'
        dateKey='date'
        dateFormat='ISO'
        interval={data[0]?.interval}
      />
      )
    : (
      <StyledCustomBarChart
        isFetching={status !== SUCCEED}
        data={data[0]?.merges || []}
        valueKey='merged'
        dateKey='date'
        dateFormat='ISO'
        interval={data[0]?.interval}
      />
      )
}

const Contributors = (props) => {
  const {
    data,
    status
  } = props

  const classes = useStyles()

  return data?.length > 1
    ? (
      <MultipleLineChart
        data={data.map(({ repoName, population }) => {
          return {
            repository: {
              name: repoName,
            },
            dataSet: population
          }
        })}
        status={status}
        gitUrls={[data[0]?.gitUrl]}
        title='Number of Contributors'
        valueKey='contributors'
        featured
        interval={data[0]?.interval}
      />
      )
    : (
      <>
        <Typography variant='h3' className={classes.chartTitle}>Number of Contributors</Typography>
        <CustomChartLegend
          data={[
            { type: 'line', label: 'Total Contributors' },
            { type: 'Bar', label: 'Increments' }
          ]}
        />
        <LineWithBars
          data={data[0]?.population || []}
          status={status}
          gitUrls={[data[0]?.gitUrl]}
          title='Number of Contributors'
          valueKey='contributors'
          interval={data[0]?.interval}
          featured
        />
      </>
      )
}

function Repositories () {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [gitUrls, setGitUrls] = useState([])
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const projects = useSelector((state) => {
    return state.projects
  })

  const successfullProjects = useMemo(() => {
    return projects.data.filter(({ error }) => !error?.length)
  }, [projects])

  const failedProjects = useMemo(() => {
    return projects.data.filter(({ error }) => error?.length)
  }, [projects])

  useEffect(() => {
    if (startDate?.length && endDate?.length && gitUrls?.length) {
      const payload = {
        startDate,
        endDate,
        gitUrls
      }
      dispatch({ type: FETCH_PROJECTS, payload })
    }
  }, [startDate, endDate, gitUrls, dispatch])

  const onFilterChange = useCallback((startDate, endDate, repository) => {
    if (startDate) {
      setStartDate(startDate)
    }
    if (endDate) {
      setEndDate(endDate)
    }
    if (repository?.value) {
      setGitUrls([repository.value])
    } else if (Array.isArray(repository)) {
      setGitUrls(
        repository.map(({ value }) => value)
      )
    }
  }, [])

  return (
    <PageContainer>
      <PageTitle>My Projects - Repositories</PageTitle>
      <PageFilter
        onFilterChange={onFilterChange}
        errors={failedProjects}
        multiRepo
      />
      <PageSubtitle>Population</PageSubtitle>
      <HelpText>
        What is the growth of the contributor population in the selected&nbsp;
        <Plural
          value={successfullProjects?.length ?? 0}
          one='repository'
          other='repositories'
        />?
      </HelpText>
      <Card>
        <CardContent>
          <Contributors
            data={successfullProjects}
            status={projects.status}
          />
        </CardContent>
      </Card>
      <PageSubtitle margin='15px 0 10px'>Repository ELOC</PageSubtitle>
      <StyledGrid marginBottom='40'>
        <StyledGridItem>
          <HelpText>
            What is the amount of code all contributors in the repository have written?
          </HelpText>
          <Card>
            <CardContent>
              <TotalEloc
                data={successfullProjects}
                status={projects.status}
                showVariation={false}
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
          <StyledIncrementalElocWrapper>
            <Card className={classes.cardBottom}>
              <CardContent>
                <Typography variant='h3' className={classes.chartTitle}>Incremental ELOC</Typography>
                <IncrementalEloc
                  data={successfullProjects}
                  status={projects.status}
                />
              </CardContent>
            </Card>
          </StyledIncrementalElocWrapper>
        </StyledGridItem>
      </StyledGrid>
      <StyledGrid marginBottom='40'>
        <StyledGridItem overflowHidden>
          <PageSubtitle>Merges</PageSubtitle>
          <HelpText>
            How many PR/MRs have been merged in the selected&nbsp;
            <Plural
              value={successfullProjects?.length ?? 0}
              one='repository'
              other='repositories'
            />?
          </HelpText>
          <Card>
            <CardContent>
              <Typography variant='h3' className={classes.chartTitle}>Number of PR/MR Merges</Typography>
              <MergeRequests
                data={successfullProjects}
                status={projects.status}
              />
            </CardContent>
          </Card>
        </StyledGridItem>
        <StyledGridItem overflowHidden>
          <PageSubtitle>Quality</PageSubtitle>
          <HelpText>
            What is the code quality of the selected&nbsp;
            <Plural
              value={successfullProjects?.length ?? 0}
              one='repository'
              other='repositories'
            />?
          </HelpText>
          <Card>
            <CardContent>
              <QualityComparison
                projects={{
                  data: successfullProjects,
                  status: projects.status
                }}
              />
            </CardContent>
          </Card>
        </StyledGridItem>
      </StyledGrid>
    </PageContainer>
  )
}

export default function BoundedRepositories () {
  return (
    <Panel>
      <ErrorBoundary>
        <Repositories />
      </ErrorBoundary>
    </Panel>
  )
}
