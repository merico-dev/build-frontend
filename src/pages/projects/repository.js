import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react'
import styled from '@emotion/styled'
import {
  Button,
  makeStyles,
  Link as MuiLink,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Container,
  Grid
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import { fetchData } from '@/utils/fetchData'

import { FETCH_PROJECT_PROFILE } from '@/store/reducers/projectProfile'
import Panel from '@/layouts/Panel'
import ErrorBoundary from '@/components/ErrorBoundary'
import HelpText from '@/components/HelpText'
import PageTitle from '@/components/Page/PageTitle'
import PageSubtitle from '@/components/Page/PageSubtitle'
import PageLoading from '@/components/PageLoading'
import Ranking from '@/components/Ranking/Ranking'
import CustomChartLegend from '@/components/CustomChartLegend/CustomChartLegend'
import LineWithBars from '@/components/LineWithBars/LineWithBars'
import CustomBarChart from '@/components/CustomBarChart/CustomBarChart'
import { StyledGrid, StyledGridItem } from '@/components/StyledGrid/StyledGrid'
import { getUserByProjectUrl } from '@/utils/repositories/projectUrl'
import { useContributorProfileRouter } from '@/utils/contributor/routeHelper'
import { ReactComponent as SearchIcon } from '@/icons/search.svg'

const StyledRepository = styled.div`
  max-width: 1240px;
  width: 100%;
  margin: 40px auto 0;
  padding: 0 15px;
  padding-bottom: 120px;
`

const StyledExplanationText = styled.div`
  color: var(--color-gray-500);
  font-size: var(--text-xl);
  margin-bottom: 20px;
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop};`}
  ${({ textAlign }) => textAlign && `text-align: ${textAlign};`}
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

const StyledRepositorySearch = styled.div`
  margin: 0 0;
`

const StyledRepositorySearchResults = styled.div`
  font-weight: 600;
  font-size: 36px;
  text-align: center;
  color: var(--color-gray-500);
  margin-bottom: 20px;
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
  },

})

const searchInputStyles = makeStyles({
  root: {
    '& fieldset': {
      borderColor: 'var(--color-orange-500)',
      borderRadius: '3px',
      borderWidth: '1px'
    }
  }
})

const defaultRepositorySearchResult = {
  name: null,
  owner: null,
  gitUrl: null
}

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
      <MuiLink href={repoUser.url} target='_blank' data-test='repository-owner-link'>
        {repoUser.user}
      </MuiLink> /&nbsp;
      <MuiLink href={url} target='_blank' data-test='repository-name-link'>{repoName}</MuiLink>
    </>
  )
}

function Repository () {
  const classes = useStyles()
  const searchInputClasses = searchInputStyles()
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

  const [isSearching, setIsSearching] = useState(false)
  const [searchKeywords, setSearchKeywords] = useState('')
  const [searchResults, setSearchResults] = useState({
    active: false,
    error: null,
    repository: defaultRepositorySearchResult
  })

  const noRepoErrorMessage = 'We currently do not have this project\'s profile in our database, please sign up to import this project.'
  const invalidGitUrlErrorMessage = 'You have entered an invalid GitURL.'
  const invalidGitFormatMessage = 'This URL doesn\'t appear to be valid format.'

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

  const searchProjects = () => {
    const findProjects = async (gitUrl) => {
      try {
        setIsSearching(true)

        const searchResponse = await fetchData(`/projects/public-profiles/search?gitUrl=${gitUrl}`)

        const active = !!searchResponse
        const error = active ? null : noRepoErrorMessage
        const repository = active
          ? { ...searchResponse.data, owner: searchResponse.data.gitUrl.split('/').reverse()[1] }
          : defaultRepositorySearchResult

        setSearchResults({ active, error, repository })
      } catch (e) {
        setSearchResults({
          active: false,
          error: invalidGitUrlErrorMessage,
          repository: defaultRepositorySearchResult
        })
      }

      setTimeout(() => {
        setIsSearching(false)
      }, 1000)
    }

    if (searchKeywords !== '') {
      findProjects(searchKeywords)
    }
  }

  const resetSearch = () => {
    setSearchKeywords('')
    setSearchResults({
      active: false,
      error: null,
      repository: {
        name: null,
        owner: null,
        gitUrl: null
      }
    })
    setIsSearching(false)
  }

  const isValidGitUrl = (url) => {
    return ['http://', 'https://', 'git://'].some((protocol) => url.startsWith(protocol)) && url.endsWith('.git')
  }

  useEffect(() => {
    // Re-Draw on Search Processing
  }, [isSearching])

  useEffect(() => {
    // Re-Draw on Search Results
  }, [searchResults])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    resetSearch()
  }, [gitUrl])

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
          data-test='learn-more-button'
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
      <div data-test='top-contributors-datagrid'>
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
      </div>
      <StyledPopulationWrapper>
        <PageSubtitle>Population</PageSubtitle>
        <HelpText>
          What is the growth of the contributor population in this repository?
        </HelpText>
        <Card>
          <CardContent>
            <Typography variant='h3' className={classes.chartTitle}>Number of Contributors</Typography>
            <div data-test='population-graph'>
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
            </div>
          </CardContent>
        </Card>
      </StyledPopulationWrapper>
      <StyledGrid marginTop={40}>
        <StyledGridItem>
          <PageSubtitle>Repository ELOC</PageSubtitle>
          <HelpText>
            What is the amount of code all contributors in the repository have written?<br />
            To learn more about how ELOC works:&nbsp;
            <MuiLink href='https://playground.mericobuild.com' target='_blank' data-test='explore-playground-link'>
              <strong>Explore ELOC Playground</strong>
            </MuiLink>
          </HelpText>
          <Card className={classes.cardBottom}>
            <CardContent>
              <Typography variant='h3' className={classes.chartTitle}>Incremental ELOC</Typography>
              <StyledCustomBarChartWrapper data-test='incremental-eloc-graph'>
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
                <StyledCustomBarChartWrapper data-test='number-of-merges-graph'>
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
      <StyledExplanationText marginTop='40px' textAlign='center'>
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
      <StyledExplanationText marginTop='40px' textAlign='center'>
        To search for other project profiles, paste a GitHub or GitLab
        repository URL to the following form:
      </StyledExplanationText>
      <StyledRepositorySearch data-test='repository-search-form'>
        <form noValidate autoComplete='off'>
          <Container maxWidth='md'>
            <Grid container className={classes.grid} spacing={2} direction='row' justify='center' alignItems='flex-start'>
              <Grid item xs={12} md={8}>
                <TextField
                  classes={searchInputClasses}
                  id='search-project-keywords'
                  placeholder='https://github.com/mrdoob/three.js'
                  label='Project GitURL'
                  variant='outlined'
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  data-test='search-projects-input'
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'><SearchIcon width='18' height='18' color='#ED6A45' /></InputAdornment>
                  }}
                  disabled={isSearching}
                  readOnly={isSearching}
                  helperText={searchKeywords !== '' && !isValidGitUrl(searchKeywords) ? invalidGitFormatMessage : ''}
                  error={searchKeywords !== '' && !isValidGitUrl(searchKeywords)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  color='primary'
                  variant='contained'
                  size='small'
                  className={classes.button}
                  disabled={
                    isSearching || searchKeywords?.toString().length === 0 ||
                    (searchKeywords !== '' &&
                    !isValidGitUrl(searchKeywords))
                  }
                  onClick={searchProjects}
                  data-test='search-projects-button'
                >
                  {isSearching ? 'Searching ...' : 'Search'}
                </Button>
              </Grid>
              {!isSearching && !searchResults?.active && searchResults?.error && (
                <Grid item xs={12}><HelpText textAlign='center'>{searchResults?.error}</HelpText></Grid>
              )}
            </Grid>
          </Container>
        </form>
        {isSearching && (
          <Container maxWidth='sm'>
            <Grid container className={classes.grid} spacing={0} direction='row' justify='center' alignItems='center'>
              <Grid item xs={3} zeroMinWidth style={{ padding: '40px 0 0 0', textAlign: 'center' }}>
                <PageLoading size={20} textAlign='center' />
              </Grid>
            </Grid>
          </Container>
        )}
        {!isSearching && searchResults?.active && (
          <>
            <StyledExplanationText marginTop='40px' textAlign='center' data-test='search-result-success-message'>
              We have found <strong>one</strong> result:
              {gitUrl === searchResults?.repository?.gitUrl && '(Current Profile)'}
            </StyledExplanationText>
            <StyledRepositorySearchResults data-test='search-results-repository'>
              {searchResults.repository?.owner} / {searchResults.repository?.name}
            </StyledRepositorySearchResults>
            <StyledButtonContainer>
              <Button
                color='primary'
                variant='contained'
                size='large'
                className={classes.button}
                component={Link}
                to={`/projects/repository/overview?gitUrl=${searchResults.repository?.gitUrl}`}
                data-test='search-results-repository-view-button'
                disabled={gitUrl === searchResults?.repository?.gitUrl}
              >
                {gitUrl === searchResults?.repository?.gitUrl ? 'Active Profile' : 'View Profile'}
              </Button>
            </StyledButtonContainer>
          </>
        )}
      </StyledRepositorySearch>
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
