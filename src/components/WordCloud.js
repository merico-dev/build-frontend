import React from 'react'
import styled from '@emotion/styled'
import { Typography, withStyles } from '@material-ui/core'

import { mdMedia } from '@/styles/snippets/responsive'

const StyledWord = styled.div`
  box-shadow: var(--elevation-1);
  color: var(--color-primary-400);
  background: var(--color-background-orange-400);
  font-weight: bold;
  padding: 3px 10px 5px;
  display: inline-block;
  margin: 5px;
  font-size: var(--text-sm);
`

const StyledTypography = withStyles(() => ({
  h2: {
    fontSize: 'var(--text-xl)',
    margin: '8px 0 20px'
  }
}))(Typography)

const StyledWordCloud = styled.div`
  ${mdMedia(`
    padding-bottom: 8px;
  `)}
`

export default function WordCloud (props) {
  const {
    words,
    title
  } = props

  return (
    <StyledWordCloud>
      <StyledTypography variant='h2'>{title}</StyledTypography>
      <div>
        {words.map((word) => (
          <StyledWord key={word}>{word}</StyledWord>
        ))}
      </div>
    </StyledWordCloud>
  )
}
