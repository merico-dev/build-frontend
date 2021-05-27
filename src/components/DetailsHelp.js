import React from 'react'
import styled from '@emotion/styled'
import {
  Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-primary-500);
  margin-left: 3px;
`

const StyledDetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 45px;
  color: var(--color-gray-400);
`

export default function DetailsHelp (props) {
  const {
    children,
    more
  } = props

  return (
    <StyledDetailsWrapper>
      <QuestionCircle width='29' height='29' />
      <Typography variant='body1'>
        {children}
        {more ? <StyledLink to={more}>Read More</StyledLink> : null}
      </Typography>
    </StyledDetailsWrapper>
  )
}
