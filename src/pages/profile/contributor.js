import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useSelector } from 'react-redux'
// import PageLoading from '@/components/PageLoading'
import Panel from '@/layouts/Panel'
import { InvitationDialog, sendContributorInvitation } from '@/components/Profile/Contributor/InvitationDialog'

import { DateTime } from 'luxon'
import { fetchData } from '@/utils/fetchData'
import { humanPercentage } from '@/utils/numbers'
import { ellipsis } from '@/utils/string'

import { Readiness } from '@/enums/repositoryReadiness'
import BadgeGrades from '@/components/Badges/BadgeGrades'
import { FAILED, SUCCEED, LOADING } from '@/store/statusTypes'

import {
  Button,
  Card,
  makeStyles,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { OutlinedPrimaryTooltip as Tooltip } from '@/components/CustomTooltip/OutlinedPrimaryTooltip'
import { useLocation, Link } from 'react-router-dom'
import { lgMedia, mdMedia, smMedia } from '@/styles/snippets/responsive'
import classNames from 'classnames'

import FilterSelect from '@/components/FilterSelect'
import CustomDateRange from '@/components/CustomDateRange/CustomDateRange'
import { shouldShowVariationByDates } from '@/utils/chart/variation'
import { getOptionsFromArray } from '@/utils/select/select'
import SingleLineChart from '@/components/SingleLineChart'
import CustomBarChart from '@/components/CustomBarChart/CustomBarChart'
import Avatar from '@/components/Avatar/Avatar'
import TopRepositories from '@/components/Profile/Contributor/TopRepositories'
import LatestCommits from '@/components/Profile/Contributor/LatestCommits'
import TopAchievementItem from '@/components/TopAchievements/TopAchievementItem'
import Badge from '@/components/badge'
import BadgeList from '@/components/Badges/BadgeList'
import { getUserAlias } from '@/utils/user/user'

import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'
import { ReactComponent as ExclamationCircle } from '@/icons/exclamation-circle.svg'
import { dashboardLink } from '@/utils/dashboardLink'

const StyledContainer = styled.div`
  max-width: 1420px;
  width: 100%;
  margin: 0 auto;
  padding: 25px;
  margin-bottom: 100px;

  ${mdMedia(`
    padding: 40px;
  `)}
`
const StyledAvatar = styled(Avatar)`
  margin: 4px 24px 10px 18px;
`
const StyledHeading = styled.h1`
  color: #4b4d58;
`

const StyledContributor = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const StyledContributorAvatar = styled.div``

const StyledContributorDetails = styled.div``

const StyledContributorName = styled.h2`
  margin: 10px 0 8px 0;
  color: #4b4d58;
`
const StyledProfileIcons = styled.div`
  > svg {
    margin-right: 16px;
  }
`

const StyledLabel = styled.div`
  color: var(--color-gray-400);
  margin: 10px 10px 5px 0;
  white-space: nowrap;
  width: 100px;
  max-width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;

  ${lgMedia(`
    align-items: center;
    flex-direction: row;
    width: auto;
    max-width: 130px;
    padding-right: 10px;
  `)}
`

const StyledTopLanguages = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;

  ${mdMedia(`
    justify-content: left;
  `)}

  & > div {
    margin-right: 15px;
    margin-bottom: 15px;
  }
`
const StyledBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;

  & > div {
    margin: 0 20px 20px 0;
  }

  & > div:nth-child(n+4) {
    display: none;
  }

  ${mdMedia(`
    & > div:nth-child(n+5) {
      display: flex;
    }
  `)}

`

const StyledProfileLink = styled.a`
  color: var(--color-brand-400);
`

const StyledBadgeSort = styled.div`
  display: flex;
  font-size: var(--text-sm);
  float: right;

  > span:first-of-type {
    margin-right: 17px;
  }

  ${smMedia(`
    font-size: var(--text-md);
  `)}
`

const pageStyles = makeStyles({
  card: {
    margin: 0,
    padding: '28px',
    color: '#717484',
    minHeight: '422px',
    '&[disabled]': {
      opacity: 0.7,
      backgroundColor: '#dddddd',
      pointerEvents: 'none'
    },
    '&.empty-message': {
      minHeight: '100px'
    }
  },
  contributorCard: {
    minHeight: '48px',
    // paddingBottom: 0
  },
  grid: {
    flexGrow: 1,
  },
  a: {
    color: '#ED6A45',
    fontSize: '18px',
  },
  h1: {
    marginTop: '60px',
  },
  h2: {
    marginBottom: '20px',
  },
  h3: {
    lineHeight: '28px',
    marginBottom: '30px',
    '& > span > svg': {
      marginLeft: '7px',
      color: '#C8C9D0',
      marginBottom: '-1px',
      cursor: 'help'
    },
  },
  p: {
    marginTop: 0,
    color: '#717484',
    '&.empty-message': {
      fontSize: '22px',
      textAlign: 'center',
      marginBottom: '0'
    }
  },
  rightAlign: {
    textAlign: 'right',
  },
})

const defaultContributorEmail = 'contributor@merico.dev'
const defaultContributor = {
  userId: null,
  displayName: 'Contributor',
  email: defaultContributorEmail,
  provider: 'Github',
  photoUrl: null,
  username: 'merico-contributor',
  profileUrl: null,
  topLanguages: [],
  badges: [],
}

const badgeSortOptions = [
  {
    value: 'grading',
    label: 'Grading'
  },
  {
    value: 'repositories',
    label: 'Repositories'
  }
]

function ProfileContributor () {
  // const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.user.status === 'SUCCEED')

  const location = useLocation()
  const classes = pageStyles()
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

  const {
    name: queryName,
    email: queryEmail,
    start: queryStartDate,
    end: queryEndDate,
    gitUrl: queryGitUrl = '',
  } = queryString.parse(window.location.search)

  const [contributorEmail, setContributorEmail] = useState()
  const [isFetching, setIsFetching] = useState(false)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [isNativeUser, setIsNativeUser] = useState(false)
  const [displayName, setDisplayName] = useState()
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [provider, setProvider] = useState('github')

  const [contributor, setContributor] = useState(defaultContributor)
  const [contributorNoExist, setContributorNoExist] = useState(true)

  const [topLanguages, setTopLanguages] = useState([])
  const [topLanguageItems, setTopLanguageItems] = useState(null)
  const [badges, setBadges] = useState([])
  const [highlightBadges, setHighlightBadges] = useState([])
  const [repositories, setRepositories] = useState([])
  const [repositoryList, setRepositoryList] = useState([])
  const [activeRepository, setActiveRepository] = useState(null)

  const [contributorData, setContributorData] = useState()
  const [repositoriesData, setRepositoriesData] = useState([])
  const [badgesData, setBadgesData] = useState([])
  const [progressData, setProgressData] = useState({
    gitUrl: null,
    progress: [],
    velocity: [],
    impact: [],
    latestCommits: [],
  })

  const [progress, setProgress] = useState([])
  const [velocity, setVelocity] = useState([])
  const [impact, setImpact] = useState([])
  const [commits, setCommits] = useState([])
  const [merges, setMerges] = useState([])
  const [interval, setInterval] = useState('day')

  const [inviteDialog, setInviteDialog] = useState(false)
  const [inviteeEmail, setInviteeEmail] = useState(null)

  const [badgesSortBy, setBadgesSortBy] = useState(badgeSortOptions[0])

  const buildRepositoryRows = (repositories) => {
    return repositories.map((repository, idx) => {
      return {
        ...repository,
        id: idx + 1,
        rank: repository.elocRank,
        repository: ellipsis(repository.repoName, 55),
        eloc: Number(repository.eloc).toFixed(0),
        impact: humanPercentage(repository.impact, 2),
        merges: Number(repository.merges).toFixed(0)
      }
    })
  }

  const buildCommitRows = (commits) => {
    return commits.map((commit, idx) => {
      return {
        ...commit,
        id: idx + 1,
        time: DateTime.fromISO(commit.date).toLocaleString({
          dateStyle: 'short',
          timeStyle: 'short'
        }),
        eloc: Number(commit.eloc).toFixed(0),
        impact: Number(commit.impact).toFixed(2),
      }
    })
  }

  const buildElocRows = (elocs) => {
    return elocs.map((eloc, idx) => {
      return {
        ...eloc,
        id: idx + 1,
        name: eloc.date,
        value: eloc.eloc
      }
    })
  }

  const buildImpactRows = (impacts) => {
    return impacts.map((impact, idx) => {
      return {
        ...impact,
        id: idx + 1,
        name: impact.date,
        value: humanPercentage(impact.impact)
      }
    })
  }

  const buildMergeRows = (merges) => {
    return merges.map((merge, idx) => {
      return {
        ...merge,
        id: idx + 1,
        name: merge.date,
        value: merge.merged
      }
    })
  }

  const inviteUser = (email) => {
    setInviteDialog(true)
  }

  const visitProviderAccount = () => {}

  const onTimeChange = (timerange) => {
    setStartDate(timerange.startDate)
    setEndDate(timerange.endDate)
  }

  const onInviteDialogClose = () => {
    setInviteDialog(false)
  }

  // useEffect(() => {
  //   dispatch({ type: FETCH_BADGES })
  // }, [dispatch])

  useEffect(() => {
    const getContributorProfile = async (email) => {
      setIsFetching(true)
      try {
        const profileResponse = await fetchData(`/contributors/profile?email=${encodeURIComponent(email)}`)
        setContributorData(profileResponse.data)
        setContributorNoExist(false)
        setIsFetching(false)
      } catch (e) {
        setIsFetching(false)
        // setContributorData({ ...defaultContributor, email: contributorEmail })
        setContributorNoExist(true)
      }
    }
    if (contributorEmail !== undefined && contributorEmail !== defaultContributorEmail && contributorEmail?.toString().length > 0) {
      setInviteeEmail(contributorEmail)
      getContributorProfile(contributorEmail)
      setContributorNoExist(false)
    } else {
      setContributorNoExist(true)
    }
  }, [contributorEmail])

  useEffect(() => {
    if (contributor && contributor.email !== defaultContributorEmail && contributorEmail !== defaultContributorEmail) {
      setIsNativeUser((contributor.userId !== null && contributor.userId !== '') ?? false)
      setDisplayName(contributor.displayName ?? contributor.username)
      setProvider(contributor.provider ?? 'github')
      setUsername(contributor.username)
      setEmail(contributor.email ?? null)
      setInviteeEmail(contributor.email ?? contributorEmail)
      setTopLanguages(contributor.topLanguages ?? [])
      setBadges(contributor.badges ?? [])

      const fetchContributorProgress = async (contributor) => {
        if (contributor) {
          try {
            setIsFetching(true)
            const repositoriesResponse = await fetchData(`/contributors/top-repositories?email=${encodeURIComponent(contributor.email)}`)
            // eslint-disable-next-line max-len
            const progressResponse = await fetchData(`/contributors/progress?email=${encodeURIComponent(contributor.email)}&gitUrl=${activeRepository?.value}&startDate=${startDate}&endDate=${endDate}`)
            const badgesResponse = await fetchData(`/contributors/badges?email=${encodeURIComponent(contributor.email)}`)
            setRepositoriesData(repositoriesResponse.data)
            setProgressData(progressResponse.data)
            setBadgesData(badgesResponse.data)
            setIsFetching(false)
          } catch (e) {
            setIsFetching(false)
          }
        }
      }
      fetchContributorProgress(contributor)
    }
  }, [
    contributor,
    startDate,
    endDate,
    activeRepository,
    contributorEmail,
    // isNativeUser
  ])

  useEffect(() => {}, [badges])

  useEffect(() => {
    setInterval(progressData.interval ?? 'day')
    setProgress(buildElocRows(progressData.progress))
    setVelocity(buildElocRows(progressData.velocity))
    setImpact(buildImpactRows(progressData.impact))
    setCommits(buildCommitRows(progressData.latestCommits))
    setMerges(buildMergeRows(progressData.merges ?? []))
  }, [progressData])

  useEffect(() => {
    setRepositories(buildRepositoryRows(repositoriesData))
  }, [repositoriesData])

  useEffect(() => {
    setRepositoryList(repositories.map((repo, idx) => {
      return {
        ...repo,
        id: idx,
        name: repo.repoName,
        fullName: repo.gitUrl ? `${repo.gitUrl?.split('/').reverse()[1]} / ${repo.repoName}` : repo.repoName,
        gitUrl: repo.gitUrl,
        status: Readiness.READY
      }
    }))
  }, [repositories])

  useEffect(() => {
    setBadges(badgesData)
    setBadgesSortBy(badgeSortOptions[0])
  }, [badgesData])

  useEffect(() => {
    setContributor(contributorData)
  }, [contributorData])

  useEffect(() => {
  }, [activeRepository])

  useEffect(() => {
  }, [badges])

  useEffect(() => {
    setTopLanguageItems(topLanguages.map((language, idx) => {
      return (
        <TopAchievementItem
          key={`language-item-${idx}`}
          language={language.language}
          rankNumerator={language.eloc}
          boxElevation={0}
        />
      )
    }))
  }, [topLanguages])

  useEffect(() => {
    if (location && location.state) {
      setStartDate(location.state.start)
      setEndDate(location.state.end)
      setContributorEmail(location.state.contributorEmail)
      setDisplayName(location.state.contributorName)
      setActiveRepository({
        label: location.state.gitUrl.split('/').reverse().shift().replace('.git', ''),
        value: location.state.gitUrl
      })
    } else {
      // Allow Public URL Access w/ Query Params
      setStartDate(queryStartDate)
      setEndDate(queryEndDate)
      setContributorEmail(decodeURIComponent(queryEmail))
      setDisplayName(queryName)
      if (queryGitUrl !== '') {
        setActiveRepository({
          label: queryGitUrl.split('/').reverse().shift().replace('.git', ''),
          value: queryGitUrl
        })
      }
    }
  }, [location, queryStartDate, queryEndDate, queryEmail, queryName, queryGitUrl])

  useEffect(() => {
    const topBadges = badges.filter(badge => badge.grade !== 'NONE').slice(0, 8)
    const goldBadges = topBadges.filter(badge => badge.grade === 'GOLD')
    const silverBadges = topBadges.filter(badge => badge.grade === 'SILVER')
    const ironBadges = topBadges.filter(badge => badge.grade === 'IRON')
    setHighlightBadges(goldBadges.concat(silverBadges, ironBadges))
  }, [badges])

  if (!isFetching && contributorNoExist) {
    return (
      <StyledContainer data-test='contributor-profile-404-container'>
        <StyledHeading data-test='contributor-profile-404-heading-not-available'>Contributor Unavailable</StyledHeading>
        <Card className={classNames(classes.card, classes.contributorCard)} align='center'>
          <h3>Please try again ...</h3>
          <p data-test='contributor-profile-404-message-not-available'>
            The Contributor profile you requested does not exist or an invalid <strong>e-mail address</strong> was provided.
          </p>
          <Link to={dashboardLink()} style={{ textDecoration: 'none' }}>
            <Button
              variant='contained'
              color='primary'
              data-test='contributor-profile-404-continue-button'
            >
              Continue
            </Button>
          </Link>
        </Card>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer data-test='contributor-profile-container'>
      <StyledHeading data-test='contributor-profile-heading'>Contributor Profile</StyledHeading>
      <Card className={classNames(classes.card, classes.contributorCard)}>
        {contributor && (
          <StyledContributor>
            <StyledContributorAvatar data-test='contributor-profile-avatar'>
              <StyledAvatar
                size={isLgUp ? '96px' : '64px'}
                iconSize={isLgUp ? '38' : '24'}
                color='primary'
                url={contributor?.photoUrl}
                boxElevation={0}
                data-username={username}
                data-email={email}
              />
            </StyledContributorAvatar>
            <StyledContributorDetails data-test='contributor-profile-details'>
              <StyledContributorName data-test='contributor-profile-name'>
                <span>{getUserAlias({
                  ...contributor,
                  displayName
                })}
                </span>
              </StyledContributorName>
              <StyledProfileIcons>
                {provider === 'github' && (
                  <StyledProfileLink
                    href={contributor?.profileUrl ?? '#'}
                    target='_blank'
                    rel='noreferrer'
                    style={{ marginRight: '16px' }}
                    data-test='contributor-profile-url'
                  >
                    <Github
                      width='21'
                      color='#ED6A45'
                      onClick={visitProviderAccount}
                    />
                  </StyledProfileLink>
                )}
                {provider === 'gitlab' && (
                  <StyledProfileLink href={contributor?.profileUrl ?? '#'} target='_blank' rel='noreferrer' style={{ marginRight: '16px' }}>
                    <Gitlab
                      width='21'
                      color='#ED6A45'
                      onClick={visitProviderAccount}
                    />
                  </StyledProfileLink>
                )}
              </StyledProfileIcons>
            </StyledContributorDetails>
          </StyledContributor>
        )}
        {isAuthenticated && !isNativeUser && !isFetching && (
          <>
            <p>
              {`
                Invite this contributor to claim their account in order to improve data quality, earn badges, and gain insights.
              `}
            </p>
            <Button
              variant='contained'
              color='primary'
              style={{ display: 'block', margin: '18px auto 0 auto' }}
              onClick={() => inviteUser('developer@merico.dev')}
              data-test='contributor-invitation-button'
            >
              <span>+</span> &nbsp; Invite
            </Button>
          </>
        )}
        {isNativeUser && topLanguageItems.length > 0 && (
          <>
            <Typography variant='h3' className={classNames(classes.h3)} style={{ marginBottom: '20px' }}>
              Top Languages
              <Tooltip
                title={<>Global ranking based on 2k+ OSS developers. <a href='/help'>Learn more</a></>}
                placement='right'
                interactive
                arrow
              >
                <span><ExclamationCircle width='18' height='18' /></span>
              </Tooltip>
            </Typography>
            <StyledTopLanguages data-test='contributor-profile-languages'>
              {topLanguageItems}
            </StyledTopLanguages>
          </>
        )}
        {isNativeUser && badges.length > 0 && (
          <>
            <Typography variant='h3' className={classNames(classes.h3)}>
              Badge Highlights
            </Typography>
            <StyledBadges data-test='contributor-profile-badges'>
              {highlightBadges.map((badge, idx) => (
                <div key={`badge-key-${idx}`}>
                  <Badge
                    name={badge.name}
                    image={badge.imageUrl}
                    icon={badge?.BadgeType?.icon}
                    description={badge.description}
                    type={badge?.BadgeType?.title}
                    locked={badge.grade === 'NONE'}
                    id={badge.id}
                  />
                </div>)
              )}
            </StyledBadges>
          </>
        )}
      </Card>
      <Typography variant='h1' className={classNames(classes.h1)}>
        Top Repositories
      </Typography>

      {isNativeUser && (
        <p className={classNames(classes.p)}>
          {`
            If you do not see the repositories you are looking for,
            the user might not have imported all of their repositories to Merico Build.
            You can view the complete list of repositories on their
          `}
          <StyledProfileLink href={contributor?.profileUrl ?? '#'} target='_blank' rel='noreferrer'>
            {contributor?.provider === 'github' ? 'GitHub' : 'GitLab'}
          </StyledProfileLink>
        </p>
      )}

      {!isNativeUser && (
        <p className={classNames(classes.p)}>
          {`
            Invite this contributor to claim their account, so Merico Build can analyze their repositories.
          `}
        </p>
      )}
      <div data-test='contributor-profile-repositories-grid'>
        <TopRepositories provider={provider} data={repositories} />
      </div>

      <Typography variant='h1' className={classNames(classes.h1)}>
        Progress
      </Typography>
      <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }} data-test='contributor-profile-progress'>
        <div style={{
          display: 'flex',
          justifyContent: 'left',
          flex: '1',
          alignItems: 'center',
          paddingRight: '30px',
          paddingBottom: '10px'
        }}
        >
          <StyledLabel>Repository</StyledLabel>
          <FilterSelect
            value={activeRepository}
            setValue={setActiveRepository}
            options={getOptionsFromArray(repositoryList, 'gitUrl', 'fullName', (item) => (
              item.status === Readiness.UNDERWAY &&
                  !item.lastSyncTime
            ))}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'left', flex: '1', alignItems: 'center', paddingBottom: '10px' }}>
          <StyledLabel>Time Range</StyledLabel>
          <CustomDateRange
            onRangeChange={onTimeChange}
            // initialStartDate={startDate}
            // initialEndDate={endDate}
          />
        </div>
        <div style={{ flex: '2' }}>&nbsp;</div>
      </div>
      <Typography variant='h2' className={classNames(classes.h2)} style={{ marginTop: '40px' }}>
        ELOC
      </Typography>
      <Grid container className={classes.grid} spacing={2}>
        <Grid item xs={12} md={6}>
          <p className={classNames(classes.p)}>
            How much code has <strong>{getUserAlias({ ...contributor, displayName })}</strong> written? &nbsp;
            <a className={classNames(classes.a)} href='/help#eloc' rel='noreferrer' data-test='learn-more-link-eloc'>
              Learn more
            </a>
          </p>
          <Card className={classNames(classes.card)}>
            <Typography variant='h3' className={classNames(classes.h3)}>
              Total ELOC
              <Tooltip
                // eslint-disable-next-line max-len
                title={<>The amount of code a contributor has written, measured in ELOC, a similar but less noisey metric than LOC. <a href='/help#eloc' rel='noreferrer'>Learn more</a></>}
                placement='top'
                interactive
                arrow
              >
                <span><ExclamationCircle width='18' height='18' /></span>
              </Tooltip>
            </Typography>
            <div data-test='contributor-profile-progress-total-eloc'>
              <SingleLineChart
                height={290}
                data={progress}
                status={isFetching ? FAILED : SUCCEED}
                gitUrls={[]}
                title=''
                valueKey='value'
                featured
                showVariation={false}
                showHeading={false}
                interval={interval}
              />
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <p className={classNames(classes.p, classes.rightAlign)}>
            <a
              className={classNames(classes.a)}
              href='https://playground.mericobuild.com'
              target='_blank'
              rel='noreferrer'
              data-test='eloc-playground-link'
            >
              Explore ELOC Playground
            </a>
          </p>
          <Card className={classNames(classes.card)}>
            <Typography variant='h3' className={classNames(classes.h3)}>
              Incremental ELOC
              <Tooltip
                // eslint-disable-next-line max-len
                title={<>The amount of contributor ELOC for the selected timeframe. <a href='/help#eloc' rel='noreferrer'>Learn more</a></>}
                placement='top'
                interactive
                arrow
              >
                <span><ExclamationCircle width='18' height='18' /></span>
              </Tooltip>
            </Typography>
            <div data-test='contributor-profile-progress-incremental-eloc'>
              <CustomBarChart
                isFetching={isFetching}
                data={velocity}
                height={290}
                interval={interval}
                dateFormat='ISO'
              />
            </div>
          </Card>
        </Grid>
      </Grid>

      <Grid container className={classes.grid} spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant='h2' className={classNames(classes.h2)}>
            Impact
          </Typography>
          <p className={classNames(classes.p)}>
            How much impact does &nbsp;
            <strong>
              {
                // eslint-disable-next-line max-len
                `${getUserAlias({ ...contributor, displayName })}${getUserAlias({ ...contributor, displayName }).endsWith('s') ? '\'' : '\'s'}` ?? 'this contributor\'s'
              }
            </strong> code have on other contributors’ code?
          </p>
          <Card className={classNames(classes.card)}>
            <Typography variant='h3' className={classNames(classes.h3)}>
              Impact
              <Tooltip
                // eslint-disable-next-line max-len
                title={<>The amount of impact a contributor’s code has on other contributors’ code in this repository. <a href='/help#impact'>Learn more</a></>}
                placement='top'
                interactive
                arrow
              >
                <span><ExclamationCircle width='18' height='18' /></span>
              </Tooltip>
            </Typography>
            <div data-test='contributor-profile-impact'>
              <SingleLineChart
                height={290}
                data={impact}
                status={isFetching ? FAILED : SUCCEED}
                gitUrls={[]}
                title=''
                valueKey='value'
                featured
                yDomain={[0, 100]}
                showVariation={shouldShowVariationByDates(startDate, endDate)}
                showHeading={false}
                interval={interval}
              />
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='h2' className={classNames(classes.h2)}>
            Merges
          </Typography>
          <p className={classNames(classes.p, classes.rightAlign)}>
            How many of my PR/MRs have been merged? &nbsp;
            <a
              className={classNames(classes.a)}
              href='/help#merges'
              target='_blank'
              rel='noreferrer'
              data-test='learn-more-link-merges'
            >
              Learn More
            </a>
          </p>
          <Card className={classNames(classes.card)}>
            <Typography variant='h3' className={classNames(classes.h3)}>
              Number of PR/MR Merges
              <Tooltip
                // eslint-disable-next-line max-len
                title={<>The amount of PR/MRs approved. <a href='/help#merges'>Learn more</a></>}
                placement='top'
                interactive
                arrow
              >
                <span><ExclamationCircle width='18' height='18' /></span>
              </Tooltip>
            </Typography>
            <div data-test='contributor-profile-merges-grid'>
              <CustomBarChart
                isFetching={isFetching}
                data={merges}
                height={290}
                interval={interval}
                dateFormat='ISO'
              />
            </div>
          </Card>
        </Grid>
      </Grid>

      <Typography variant='h2' className={classNames(classes.h2)}>
        Latest Commits
      </Typography>
      <div data-test='contributor-profile-commits-grid'>
        <LatestCommits data={commits} />
      </div>
      {isNativeUser && (
        <>
          <Typography variant='h2' className={classNames(classes.h2)}>
            Badges
          </Typography>
          <Card className={badges.length > 0 ? classNames(classes.card) : classNames(classes.card, 'empty-message')}>
            {badges.length > 0
              ? (
                <>
                  <Grid container className={classes.grid} spacing={2}>
                    <Grid item xs={12} md={6}>
                      {badgesSortBy.value === 'grading' && (
                        <BadgeGrades />
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <StyledBadgeSort>
                        <span>Sort by</span>
                        <FilterSelect
                          width={160}
                          value={badgesSortBy}
                          setValue={setBadgesSortBy}
                          options={badgeSortOptions}
                        />
                      </StyledBadgeSort>
                    </Grid>
                  </Grid>
                  <div data-test='contributor-profile-badges-list'>
                    <BadgeList
                      badges={{ data: badges, status: isFetching ? LOADING : SUCCEED }}
                      sortBy={badgesSortBy}
                    />
                  </div>
                </>
                )
              : (
                <div data-test='contributor-profile-no-badges'>
                  <p className={classNames(classes.p, 'empty-message')}>
                    You have not earned any badges, try re-analyzing your repositories!
                  </p>
                </div>
                )}
          </Card>
        </>
      )}
      {inviteDialog && (
        <InvitationDialog
          open={inviteDialog}
          contributorEmail={inviteeEmail}
          gitUrl={location.state?.gitUrl ?? activeRepository?.value}
          onDialogClose={onInviteDialogClose}
          onSend={sendContributorInvitation}
        />
      )}
    </StyledContainer>
  )
}

export default function BoundedProfileContributor () {
  return (
    <Panel sidebar={false} topbarProps={{ isPublic: false }}>
      <Helmet>
        <title>Profile - Merico Build</title>
      </Helmet>
      <ErrorBoundary style={{ padding: '0 50px' }}>
        <ProfileContributor />
      </ErrorBoundary>
    </Panel>
  )
}
