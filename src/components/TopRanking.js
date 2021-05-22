import React from 'react'
import {
  Typography,
  withStyles
} from '@material-ui/core'
import styled from '@emotion/styled'

const StyledTypography = withStyles({
  h3: {
    fontSize: 'var(--text-xl)',
    color: 'var(--color-gray-500)',
    textAlign: 'center'
  },
  body2: {
    fontSize: 'var(--text-xs)',
    textAlign: 'center',
    color: 'var(--color-gray-400)',
    marginBottom: '20px'
  }
})(Typography)

const StyledTopRankingItem = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 30px;
  align-items: center;
  font-size: var(--text-sm);
  &:last-of-type {
    margin-bottom: 10px;
  }
  &:after {
    content: '';
    position: absolute;
    display: block;
    left:0;
    top: 50%;
    transform: translateY(-50%);
    height: 30px;
    border-radius: 6px;
    background-color: #FFF3EB;
    box-shadow: var(--elevation-1);
    width: 100%;
    z-index: 0;
  }
`

const StyledTopRankingTitle = styled.div`
  z-index: 2;
  display: flex;
  align-items: center;
  margin-left: 10px;
  height: 30px;
  font-size: var(--text-sm);
  font-weight: bold;
  color: var(--color-primary-400);
`

export default function TopRanking (props) {
  const {
    ranking
  } = props
  const visibleRepositories = ranking.slice(0, 5)
  const totalUsers = visibleRepositories.reduce((acc, curr) => {
    return acc + Number(curr.num_uses)
  }, 0)
  return (
    <div>
      <StyledTypography variant='h3'>Top Skills</StyledTypography>
      <StyledTypography variant='body2'>From {totalUsers} users</StyledTypography>
      {
        ranking.slice(0, 5).map(({ tag_name }) => (
          <StyledTopRankingItem key={tag_name}>
            <StyledTopRankingTitle>{tag_name}</StyledTopRankingTitle>
          </StyledTopRankingItem>
        ))
      }
    </div>
  )
}
