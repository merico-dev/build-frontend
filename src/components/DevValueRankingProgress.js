import React from 'react'
import { Plural, Trans } from '@lingui/macro'
import { Typography, withStyles } from '@material-ui/core'

import MultipleRanking from '@/components/MultipleRanking'
import SimpleRankingContributors from '@/components/SimpleRankingContributors'

const StyledTypography = withStyles({
  h3: {
    marginBottom: '39px'
  }
})(Typography)

export default function DevValueRankingProgress (props) {
  const {
    ranking
  } = props

  return (
    <>
      <StyledTypography variant='h3'><Trans>My Dev Share Ranking Progress</Trans></StyledTypography>
      <SimpleRankingContributors variant='body2'>
        {ranking.contributors}&nbsp;
        <Plural value={ranking.contributors ?? 0} one='contributor' other='contributors' />
      </SimpleRankingContributors>
      <MultipleRanking
        featured
        max={ranking.data.contributors}
        data={ranking.data.data}
        dates={ranking.data.dates}
      />
    </>
  )
}
