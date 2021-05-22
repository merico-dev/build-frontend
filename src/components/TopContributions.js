import React from 'react'
import { useMediaQuery, useTheme } from '@material-ui/core'
import styled from '@emotion/styled'

import RadialTopChart from '@/components/RadialTopChart'
import TopContributionsList from '@/components/TopContributionsList'

const StyledTopContributionsSubtitle = styled.div`
  margin-bottom: 26px;
  display: flex;
  align-items: center;
  color: var(--color-gray-400);
  font-size: var(--text-xs);
`

const TopContributionsSubtitle = () => {
  return (
    <StyledTopContributionsSubtitle>
      Measured in Dev Share
    </StyledTopContributionsSubtitle>
  )
}

export default function TopContributions (props) {
  const {
    data
  } = props
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const series = [...data].splice(0, 5)

  return (isSmUp
    ? (
      <RadialTopChart
        title='Top Contributions'
        helpContent='Repositories with the most contributions'
        helpLink='/help'
        subtitle={<TopContributionsSubtitle />}
        data={series}
      />
      )
    : (
      <TopContributionsList
        list={series}
        subtitle={<TopContributionsSubtitle />}
      />
      )
  )
}
