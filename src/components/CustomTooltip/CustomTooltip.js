import React from 'react'
import styled from '@emotion/styled'
import { Typography } from '@material-ui/core'

import { getTitleByInterval } from '@/utils/chart/defaultTickFormatter'

const StyledCustomTooltip = styled.div`
  box-shadow: var(--elevation-1);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  padding: 8px 9px;
  color: var(--color-gray-400);
  font-size: var(--text-xs);
  background: #fff;
`

function CustomTooltipChange ({ change = 0 }) {
  if (change === 0) {
    return null
  }

  let sign = ''
  if (change > 0) {
    sign = '+'
  }

  return (
    <Typography variant='body2' color={change > 0 ? 'primary' : 'textSecondary'}>
      {sign}{change}
    </Typography>
  )
}

export default function CustomTooltip (props) {
  const {
    active,
    payload: data,
    label,
    interval,
    format
  } = props

  if (!active || !data?.length) {
    return null
  }

  const singlePayload = data[0].payload
  const hasChange = singlePayload?.change !== undefined

  return (
    <StyledCustomTooltip>
      <div>{getTitleByInterval(label, interval, format)}</div>
      {!hasChange
        ? (<div>{data[0].value}</div>)
        : (<div>Total: {data[0].value}</div>)}
      <CustomTooltipChange change={singlePayload?.change} />
    </StyledCustomTooltip>
  )
}
