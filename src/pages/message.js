import React from 'react'
import styled from '@emotion/styled'
import { Button, Container, Typography, withStyles } from '@material-ui/core'
import Panel from '@/layouts/Panel'
import { Link } from 'react-router-dom'

const StyledButton = styled(Link)`
  text-decoration: none;
  margin-top: 50px;
  display:inline-block;
  ${({ styled: { lastItem } = {} }) => lastItem ? 'margin-top: 20px' : ''}
`
// eslint-disable-next-line react/jsx-props-no-spreading
const StyledContainer = styled(({ customMaxWidth, ...rest }) => <Container {...rest} />)`
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: #fff;
  ${({ customMaxWidth }) => (customMaxWidth ? `max-width: ${customMaxWidth} !important` : '')};
  padding: 50px;
  margin: 116px auto;
  border: solid 1px var(--color-gray-400);
`

const StyledTypography = withStyles({
  h2: {
    marginTop: 0
  }
})(Typography)

export default function Message (props) {
  const {
    title,
    text,
    btnText,
    btnLink,
    secondaryBtnText,
    secondaryBtnLink,
    maxWidth,
    panel = true
  } = props

  const content = (
    <StyledContainer customMaxWidth={maxWidth}>
      <StyledTypography variant='h2'>
        {title}
      </StyledTypography>
      {
        text && (
          <StyledTypography variant='body1'>
            {text}
          </StyledTypography>
        )
      }
      {
        btnText?.length && (
          <div>
            <StyledButton to={btnLink}>
              <Button
                variant='contained'
                size='large'
                color='primary'
              >
                {btnText}
              </Button>
            </StyledButton>
          </div>
        )
      }
      {
        secondaryBtnText?.length && (
          <div>
            <StyledButton to={secondaryBtnLink} styled={{ lastItem: true }}>
              <Button
                variant='outlined'
                size='large'
                color='primary'
              >
                {secondaryBtnText}
              </Button>
            </StyledButton>
          </div>
        )
      }
    </StyledContainer>
  )

  if (!panel) {
    return content
  }

  return (
    <Panel sidebar={false}>{content}</Panel>
  )
}
