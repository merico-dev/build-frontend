import React from 'react'
import {
  IconButton
} from '@material-ui/core'

import HelpPopover from '@/components/HelpPopover'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'

export default function CustomBarHelp ({ text = '', link = '/help' }) {
  if (!text?.length) {
    return (<div style={{ flexGrow: 1 }} />)
  }
  return (
    <div style={{ flexGrow: 1 }}>
      <HelpPopover
        content={text}
        moreLink={link}
      >
        <IconButton size='small' aria-label='More information'>
          <QuestionCircle width='17.5' height='17.5' />
        </IconButton>
      </HelpPopover>
    </div>
  )
}
