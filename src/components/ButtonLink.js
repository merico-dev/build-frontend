import React from 'react'
import styled from '@emotion/styled'

import { Link } from 'react-router-dom'

const StyledLink = styled(Link)`
  display: flex;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-top: 13px;
  height: 40px;
  background: var(--color-primary-400);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 25px;
`

export default function StyleButtonLink (props) {
  const {
    to,
    children
  } = props

  return (
    <StyledLink to={to}>
      {children}
    </StyledLink>
  )
}
