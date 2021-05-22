import styled from '@emotion/styled'
import React from 'react'

import HelpPopover from '@/components/HelpPopover'
import { ReactComponent as ExclamationCircle } from '@/icons/exclamation-circle.svg'

const StyledGridHelp = styled.div`
  display: flex;
  align-items: center;

  svg {
    display: block;
    color: var(--color-gray-200);
  }
`

export default function CustomDataGridHelp (props) {
  const {
    help,
    link,
    children

  } = props

  return (
    <StyledGridHelp>
      {React.Children.map(children, (el) => el)}
      {help && (
        <HelpPopover
          content={help}
          marginLeft={7.5}
          moreLink={link}
        >
          <ExclamationCircle width='21' height='21' />
        </HelpPopover>
      )}
    </StyledGridHelp>
  )
}
