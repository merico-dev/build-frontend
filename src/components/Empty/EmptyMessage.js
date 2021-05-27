import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { emptyMessageTypes } from '@/enums/emptyMessageTypes'

const StyledLink = styled(Link)`
  color: var(--color-primary-400);
`

const useStyles = makeStyles({
  title: {
    fontWeight: 'var(--text-semibold)'
  },
  text: {
    maxWidth: '240px'
  }
})

const getMessageByType = (type) => {
  switch (type) {
    case emptyMessageTypes.noCommits:
      return {
        title: 'No data',
        text: (
          <>
            Your commits might be associated with different email addresses.
            You can add them in <StyledLink to='/account'>settings</StyledLink>.
          </>
        )
      }
    case emptyMessageTypes.noData:
      return {
        title: 'No data',
        text: (
          <>
            No activity during the selected time range
          </>
        )
      }
    case emptyMessageTypes.failure:
    default:
      return {
        title: 'Failed to Fetch Data'
      }
  }
}

export default function EmptyMessage (props) {
  const {
    type = emptyMessageTypes.noData
  } = props
  let {
    title,
    text
  } = props

  const classes = useStyles()

  if (type !== 'custom') {
    const newMessage = getMessageByType(type)
    title = newMessage.title
    text = newMessage.text
  }

  if (!title?.length && !text?.length) {
    return null
  }

  return (
    <>
      {title && (
        <Typography
          variant='body1'
          color='primary'
          className={classes.title}
        >{title}
        </Typography>
      )}
      {text && (
        <Typography
          variant='body2'
          className={classes.text}
        >{text}
        </Typography>
      )}
    </>
  )
}
