import React from 'react'
import styled from '@emotion/styled'

import AsyncTopContributions from '@/components/AsyncTopContributions'
import DeveloperCard from '@/components/DeveloperCard'
import FetchStatus from '@/components/FetchStatus'
import TopAchievements from '@/components/TopAchievements/TopAchievements'
import { lgMedia, mdMedia, smMedia } from '@/styles/snippets/responsive'
import { SUCCEED } from '@/store/statusTypes'

const StyledProfileSummary = styled.div`
  display: block;
  padding: 0;
  justify-content: center;

  ${smMedia(`
    background: #fff;
    border-radius: var(--radius-md);
    box-shadow: var(--elevation-1);
    padding: 15px 30px;
    min-height: 430px;
  `)}

  ${mdMedia(`
    display: flex;
    flex-wrap: wrap;
    padding: 30px 60px;
  `)}

  ${({ hasAchievements }) => (hasAchievements
    ? lgMedia(`
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    `)
    : lgMedia(`
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    `)
  )}
`

const StyledTopRankingWrapper = styled.div`
  margin: 20px auto 0;
  padding: 10px;
  background: #fff;
  box-shadow: var(--elevation-1);
  width: 100%;
  display: flex;
  flex-direction: column;

  ${smMedia(`
    box-shadow: none;
  `)}

  ${mdMedia(`
    padding-right: 25px;
    max-width: 270px;
    width: 50%;
  `)}

  ${lgMedia(`
    width: 270px;
    padding: 0;
  `)}
`

const StyledTopContributionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${mdMedia(`
    width: 50%;
  `)}

  ${lgMedia(`
    width: 100%;
    max-width: 100%;
    margin-left: auto;
  `)}
`

const StyledDeveloperCardWrapper = styled.div`
  width: 100%;
`

export default function ProfileSummary (props) {
  const {
    topAchievements,
    topContributions,
    userData,
    myProfile = true,
    className
  } = props

  const visibleAchievements = topAchievements.data?.filter(
    (achievement) => achievement.grade !== 'NONE'
  )?.slice(0, 5) || []

  const TopAchievementsComponent = () => {
    if (!visibleAchievements.length) {
      return null
    }

    return (
      <StyledTopRankingWrapper>
        <TopAchievements
          achievements={visibleAchievements}
          showViewAll={myProfile}
        />
      </StyledTopRankingWrapper>
    )
  }

  return (
    <StyledProfileSummary
      hasAchievements={topAchievements.status !== SUCCEED || visibleAchievements.length}
      className={className}
    >
      <StyledDeveloperCardWrapper>
        <DeveloperCard userData={userData} showProfileLink={myProfile} />
      </StyledDeveloperCardWrapper>
      {
        topAchievements.status === SUCCEED
          ? (
            <TopAchievementsComponent
              achievements={visibleAchievements}
            />
            )
          : (
            <StyledTopRankingWrapper>
              <FetchStatus status={topAchievements.status} />
            </StyledTopRankingWrapper>
            )
      }
      <StyledTopContributionsWrapper>
        <AsyncTopContributions
          topContributions={topContributions}
        />
      </StyledTopContributionsWrapper>
    </StyledProfileSummary>
  )
}
