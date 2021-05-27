import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'
import { useSelector, useDispatch } from 'react-redux'
import queryString from 'query-string'

import { SUCCEED } from '@/store/statusTypes'
import {
  FETCH_TOP_ACHIEVEMENTS,
  FETCH_TOP_CONTRIBUTIONS
} from '@/store/reducers/dashboard'
import { FETCH_LIST as FETCH_REPOSITORIES } from '@/store/reducers/repositories'
import { mdMedia } from '@/styles/snippets/responsive'
import DevShareSummary from '@/components/DevShare/DevShareSummary'
import useRepositories from '@/utils/DEPRECATED_useRepositories'
import ErrorBoundary from '@/components/ErrorBoundary'
import ProfileSummary from '@/components/Profile/ProfileSummary'

const StyledContainer = styled.div`
  padding: 26px 0;

  ${mdMedia(`
    padding: 40px 0;
  `)}
`

const StyledProfileSummary = styled(ProfileSummary)`
  margin: 0 20px;

  ${mdMedia('margin: 0 50px;')}
`

export function Home () {
  const dispatch = useDispatch()
  const { gitUrl } = queryString.parse(window.location.search)
  const {
    dashboard: {
      topAchievements,
      topContributions
    },
    user: {
      data: userData = []
    }
  } = useSelector((state) => state)

  const {
    list: repositoryList
  } = useRepositories()

  useLayoutEffect(() => {
    if (gitUrl) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, Number.MAX_SAFE_INTEGER)
      })
    }
  }, [gitUrl])

  useEffect(() => {
    dispatch({ type: FETCH_REPOSITORIES })
    dispatch({ type: FETCH_TOP_ACHIEVEMENTS })
    dispatch({ type: FETCH_TOP_CONTRIBUTIONS })
  }, [dispatch])

  const repositoriesWithDevValue = useMemo(() => {
    if (!repositoryList?.data?.length) {
      return []
    }

    const topContributionsData = topContributions?.data || []
    const repositoryListData = repositoryList.data || []

    return repositoryListData.map((repository) => {
      const contribution = topContributionsData.find(({ id }) => id === repository.projectId)

      return {
        ...repository,
        dev_value: contribution?.dev_value || 0
      }
    })
  }, [repositoryList, topContributions])

  return (
    <StyledContainer>
      <Helmet>
        <title>Dashboard - Merico Build</title>
      </Helmet>
      <StyledProfileSummary
        topAchievements={topAchievements}
        topContributions={topContributions}
        userData={userData}
      />
      {
        (repositoryList.status === SUCCEED &&
        repositoryList?.data?.length &&
        repositoryList?.data?.length)
          ? (
            <DevShareSummary
              repositories={repositoriesWithDevValue.sort((a, b) => b.dev_value - a.dev_value)}
            />
            )
          : null
      }
    </StyledContainer>
  )
}

export default function BoundedHome () {
  return (
    <ErrorBoundary style={{ padding: '50px' }}>
      <Home />
    </ErrorBoundary>
  )
}
