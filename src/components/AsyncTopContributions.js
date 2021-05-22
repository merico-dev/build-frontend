import React from 'react'

import { SUCCEED } from '@/store/statusTypes'
import FetchStatus from '@/components/FetchStatus'
import TopContributions from '@/components/TopContributions'

export default function AsyncTopContributions (props) {
  const {
    topContributions
  } = props

  if (topContributions.status !== SUCCEED) {
    return (
      <FetchStatus status={topContributions.status} />
    )
  }

  if (!topContributions?.data?.length) {
    return null
  }

  return (
    <TopContributions data={topContributions.data} />
  )
}
