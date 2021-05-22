import React from 'react'
import { SUCCEED } from '@/store/statusTypes'
import { Typography } from '@material-ui/core'
import { Plural } from '@lingui/macro'

import FetchStatus from '@/components/FetchStatus'
import SimpleRankingContributors from '@/components/SimpleRankingContributors'
import SimpleRanking from '@/components/SimpleRanking'

export default function AsyncSimpleRanking (props) {
  const {
    title,
    status,
    data,
    contextLink = null,
    onSeriesClick = () => {}
  } = props

  if (status !== SUCCEED) {
    return (
      <FetchStatus status={status} />
    )
  }

  return (
    <>
      {contextLink}
      <Typography variant='h3'>{title}</Typography>
      {
        data.data.length
          ? (
            <SimpleRankingContributors variant='body2'>
              {data.contributors}&nbsp;
              <Plural value={data.contributors ?? 0} one='contributor' other='contributors' />
            </SimpleRankingContributors>
            )
          : null
      }
      <SimpleRanking
        featured
        max={data.contributors}
        data={data.data}
        onSeriesClick={onSeriesClick}
      />
    </>
  )
}
