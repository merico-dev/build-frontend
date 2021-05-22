import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as Times } from '@/icons/times.svg'

const StyledTimes = styled(Times)`
  position: absolute;
  right: 20px;
  top: 20px;
  color: var(--color-gray-400);
  cursor: pointer;
`

export default function ModalClose (props) {
  const {
    onClick
  } = props

  return (
    <StyledTimes width='25' height='25' onClick={onClick} />
  )
}
