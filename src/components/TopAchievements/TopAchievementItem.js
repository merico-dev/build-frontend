import React from 'react'
import styled from '@emotion/styled'
import { getLinguistBadgeRank } from '@/utils/badges/linguist'

const StyledTopAchievementItem = styled.div`
position: relative;
display: flex;
flex-direction: row;
margin: 0 0 10px 0;
align-items: left;
font-size: var(--text-sm);
background-color: var(--color-background-orange-400);
${({ boxElevation }) => (boxElevation > 0 && `
  box-shadow: var(--elevation-${boxElevation});
`)}

border-radius: var(--radius-lg);
overflow: hidden;
align-items: stretch;
max-width: 270px;

&:last-of-type {

}
`

const StyledTopAchievementLanguage = styled.div`
font-weight: var(--text-normal);
color: var(--color-gray-400);
margin-right: auto;
min-height: 30px;
font-size: var(--text-xs);
padding: 5px 0 5px 11px;
width: 110px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
`
const StyledTopAchievementNumerator = styled.div`
display: flex;
align-items: center;
font-size: var(--text-xxs);
color: var(--color-brand-400);
padding: 0 5px;
`
const StyledTopAchievementRank = styled.div`
color: #fff;
background-color: var(--color-primary-400);
margin-left: auto;
display: flex;
align-items: center;
justify-content: center;
width: 60px;
font-size: var(--text-xxs);
`

export default function TopAchievementItem (props) {
  const {
    language,
    rankNumerator,
    boxElevation = 1
  } = props

  return (
    <StyledTopAchievementItem boxElevation={boxElevation} data-test='top-achievement-item'>
      <StyledTopAchievementLanguage data-test='top-achievement-language'>{language}</StyledTopAchievementLanguage>
      <StyledTopAchievementNumerator data-test='top-achievement-eloc'>
        {rankNumerator} ELOCs
      </StyledTopAchievementNumerator>
      <StyledTopAchievementRank data-test='top-achievement-rank'>
        Top {Number((getLinguistBadgeRank(rankNumerator, language)).toFixed(1))}%
      </StyledTopAchievementRank>
    </StyledTopAchievementItem>
  )
}
