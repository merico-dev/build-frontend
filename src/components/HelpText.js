import React from 'react'
import {
  Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

const StyledLink = styled(({ newLineLink, ...rest }) => <Link {...rest} />)`
  color: var(--color-primary-400);
  text-decoration: none;
  display: inline-block;
  ${({ newLineLink }) => !newLineLink && 'margin-left: 5px;'}

  &:hover {
    text-decoration: underline;
  }
`

const StyledHelpText = styled.div`
  min-height: ${({ height }) => height};
  margin-bottom: ${({ marginBottom }) => marginBottom};
`

export default function HelpText (props) {
  const {
    children,
    link,
    newLineLink = true,
    height,
    className,
    marginBottom = '20px'
  } = props

  return (
    <StyledHelpText className={className} height={height} marginBottom={marginBottom}>
      <Typography variant='body1' color='textSecondary'>
        {React.Children.map(children, (child) => child)}
        {link && (
          <>
            {newLineLink && <br />}<StyledLink to={link} newLineLink={newLineLink}>Learn more</StyledLink>
          </>
        )}
      </Typography>
    </StyledHelpText>
  )
}
