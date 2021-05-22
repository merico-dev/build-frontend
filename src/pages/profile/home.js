import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { Card, makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import {
  FETCH_PROFILE
} from '@/store/reducers/profile'
import Panel from '@/layouts/Panel'
import { mdMedia } from '@/styles/snippets/responsive'
import ProfileSummary from '@/components/Profile/ProfileSummary'
import BadgeList from '@/components/Badges/BadgeList'
import RepositoryCards from '@/components/Repositories/RepositoryCards'
import { useParams } from 'react-router-dom'
import { getProviderByProjectUrl } from '@/utils/repositories/projectUrl'
import { FAILED } from '@/store/statusTypes'
import PageErrorMessage from '@/components/PageErrorMessage'
import { grades } from '@/enums/badge'
import ErrorBoundary from '@/components/ErrorBoundary'
import { getUserAlias } from '@/utils/user/user'

const StyledContainer = styled.div`
  max-width: 1420px;
  width: 100%;
  margin: 0 auto;
  padding: 25px;

  ${mdMedia(`
    padding: 40px;
  `)}
`

const StyledPageErrorMessage = styled(PageErrorMessage)`
  text-align: center;
`

const useStyles = makeStyles({
  card: {
    margin: 0,
    padding: '20px'
  },
  badgesCard: {
    paddingBottom: 0
  }
})

function ProfileHome () {
  const {
    profile: {
      profile: {
        status,
        data: profileData = {}
      }
    }
  } = useSelector((state) => state)
  const { id } = useParams()
  const dispatch = useDispatch()
  const classes = useStyles()
  useEffect(() => {
    dispatch({ type: FETCH_PROFILE, payload: { id: Number(id) } })
  }, [dispatch, id])
  const wrapAsync = useCallback((value = []) => {
    return {
      status,
      data: value
    }
  }, [status])

  const repositories = useMemo(() => {
    return profileData?.repos?.map((repository) => {
      return {
        ...repository,
        provider: getProviderByProjectUrl(repository.url)
      }
    }).filter(({ userCommitCount }) => userCommitCount > 0) || []
  }, [profileData?.repos])

  const topAchievements = useMemo(() => {
    if (!profileData?.badges?.length) {
      return wrapAsync()
    }

    return wrapAsync(
      profileData.badges.filter((badge) => {
        return badge.type === 'linguist'
      }).sort((a, b) => b.rankNumerator - a.rankNumerator).slice(0, 5)
    )
  }, [profileData.badges, wrapAsync])

  const filteredBadges = useMemo(() => {
    if (!profileData?.badges?.length) {
      return wrapAsync()
    }

    return wrapAsync(
      profileData.badges.filter((badge) => {
        return badge.grade !== grades.none
      })
    )
  }, [profileData.badges, wrapAsync])

  if (status === FAILED) {
    return (
      <>
        <StyledContainer>
          <StyledPageErrorMessage
            title='404'
            text='Unable to find profile'
          />
        </StyledContainer>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {`${getUserAlias(profileData?.user)} - Merico Build`}
        </title>
      </Helmet>
      <StyledContainer>
        <ProfileSummary
          topAchievements={topAchievements}
          topContributions={wrapAsync(profileData.topContributions)}
          userData={profileData?.user}
          myProfile={false}
        />
        {
          repositories.length
            ? (
              <>
                <Typography variant='h2'>Repositories</Typography>
                <RepositoryCards repositories={repositories} />
              </>)
            : null
        }
        {
          profileData?.badges?.length
            ? (
              <>
                <Typography variant='h2'>Badges</Typography>
                <Card
                  className={classNames(classes.card, classes.badgesCard)}
                >
                  <BadgeList
                    badges={filteredBadges}
                    showTitles={false}
                  />
                </Card>
              </>)
            : null
        }
      </StyledContainer>
    </>
  )
}

export default function BoundedProfileHome () {
  return (
    <Panel sidebar={false} topbarProps={{ isPublic: false }}>
      <Helmet>
        <title>Profile - Merico Build</title>
      </Helmet>
      <ErrorBoundary style={{ padding: '0 50px' }}>
        <ProfileHome />
      </ErrorBoundary>
    </Panel>
  )
}
