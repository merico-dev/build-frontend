import React from 'react'
import styled from '@emotion/styled'
import { Typography, withStyles } from '@material-ui/core'
import { humanPercentage } from '@/utils/numbers'

const StyledTypography = withStyles(() => ({
  h2: {
    fontSize: 'var(--text-xl)',
    margin: '8px 0 20px'
  }
}))(Typography)

const StyledContributionsList = styled.div`
  margin-top: 20px;
  background-color: #fff;
  padding: 8px 10px 18px;
  box-shadow: var(--elevation-1);
  width: 100%;
`

const StyledContributionItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-gray-400);
  margin-bottom: 8px;
`

const StyledContributionTitle = styled.div`
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - 50px);
`

const StyledContributionValue = styled.div`
  width: 50px;
  text-align: right;
`

export default function TopContributionsList (props) {
  const {
    list = [],
    subtitle
  } = props

  return (
    <StyledContributionsList>
      <StyledTypography variant='h2'>Top Contributions</StyledTypography>
      {subtitle}
      <div>
        {
          list.map((repository) => repository.project_name && (
            <StyledContributionItem key={repository.project_name}>
              <StyledContributionTitle>{repository.project_name}</StyledContributionTitle>
              <StyledContributionValue>
                {humanPercentage(repository.dev_value)}%
              </StyledContributionValue>
            </StyledContributionItem>
          ))
        }
      </div>
    </StyledContributionsList>
  )
}
