import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet'

import ErrorBoundary from '@/components/ErrorBoundary'
import BackToDashboardLink from '@/components/BackToDashboardLink'
import Ranking from '@/components/Ranking/Ranking'
import PageFilter from '@/components/PageFilter/PageFilter'
import { useSelector } from 'react-redux'
import { fetchData } from '@/utils/fetchData'
import { useContributorProfileRouter } from '@/utils/contributor/routeHelper'

const StyledRankingPage = styled.div`
  padding: 40px 50px;
`

const StyledRepositoryName = styled.h1`
  color: var(--color-gray-500);
  margin: 0 10px 0 0;
  padding: 0;
`

const RANKING_API_ENDPOINT = '/projects/allDevMetrics'
const PAGE_SIZE = 10

const getUserPage = (userData, rows = []) => {
  if (!rows?.length) {
    return 0
  }

  const userIndex = rows.findIndex(({ gitUsername }) => {
    return [
      userData.gitlabUsername,
      userData.githubUsername
    ].includes(gitUsername)
  })

  if (!userIndex || userIndex <= 10) {
    return 0
  }

  return Math.floor((userIndex + 1) / PAGE_SIZE)
}

export function RankingPage (props) {
  const history = useHistory()
  const location = useLocation()
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [gitUrl, setGitUrl] = useState([])
  const [rows, setRows] = useState([])

  const {
    data: userData
  } = useSelector((state) => state.user)

  const goBack = (e) => {
    e.stopPropagation()
    e.preventDefault()
    history.goBack()
  }

  const onFilterChange = useCallback((startDate, endDate, repository) => {
    if (startDate) {
      setStartDate(startDate)
    }
    if (endDate) {
      setEndDate(endDate)
    }
    setGitUrl(repository?.value)
  }, [])

  const getRankingMetricsData = useCallback(async (endDate, startDate, gitUrl) => {
    if (!gitUrl) {
      return
    }

    try {
      const rankingMetricsResponse = await fetchData(RANKING_API_ENDPOINT, {
        startDate,
        endDate,
        gitUrl
      })
      setRows(rankingMetricsResponse?.data || [])
    } catch (e) {
      console.error('Failed to fetch ranking data', e)
      setRows([])
    }
  }, [])

  const ViewContributorProfile = useContributorProfileRouter(startDate, endDate, gitUrl)

  useEffect(() => {
    if (
      gitUrl !== null &&
      startDate &&
      endDate
    ) {
      getRankingMetricsData(endDate, startDate, gitUrl)

      return () => {
        // ABORT REQUEST
        // console.log(request)
      }
    }
  }, [endDate, gitUrl, startDate, getRankingMetricsData])

  return (
    <StyledRankingPage>
      <Helmet>
        <title>My Projects - Contributors - Merico Build</title>
      </Helmet>
      {
        location?.state?.referrer
          ? (
            <BackToDashboardLink
              style={{ marginLeft: 0, marginTop: 0 }}
              onClick={(e) => goBack(e)}
              to='#'
              className='back-link'
              data-test='ranking-back-link'
            >
              Back
            </BackToDashboardLink>
            )
          : null
      }
      <StyledRepositoryName data-test='ranking-repo-name'>My Projects - Contributors</StyledRepositoryName>
      <PageFilter
        onFilterChange={onFilterChange}
      />
      <Ranking
        startDate={startDate}
        endDate={endDate}
        gitUrl={gitUrl}
        rows={rows}
        page={getUserPage(userData, rows)}
        onContributorClick={ViewContributorProfile}
      />
    </StyledRankingPage>
  )
}

export default function BoundedRanking () {
  return (
    <ErrorBoundary style={{ padding: '50px' }}>
      <RankingPage />
    </ErrorBoundary>
  )
}
