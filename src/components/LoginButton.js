import React from 'react'
import { Button, withStyles } from '@material-ui/core'
import styled from '@emotion/styled'
import { Link as RouterLink } from 'react-router-dom'
import PageLoading from './PageLoading'
import config from '../../config/resolveConfig'

const StyledButton = withStyles({
  root: {
    height: '50px',
    display: 'flex',
    alignItems: 'center'
  }
})(Button)

const StyledButtonIcon = styled.div`
  display: inline-flex;
  margin-right: 15px;
  transform: translateY(1px);
`

export default function LoginButton (props) {
  const {
    service,
    ServiceIcon,
    setLoading,
    disabled,
    isLoading,
    className,
    type
  } = props

  const buttonProps = (type === 'signup')
    ? ({
        to: `/onboarding/${service.link}`,
        component: RouterLink
      })
    : ({
        href: `${config.apiUrl}/auth/${service.link}?redirectBaseUrl=${config.frontendUrl}&login=1`,
        component: 'a'
      })

  return (
    <div className={className}>
      <StyledButton
        variant='contained'
        color='primary'
        size='large'
        onClick={() => setLoading(true)}
        disabled={disabled}
        className={className}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...buttonProps}
      >
        {!isLoading
          ? (
            <>
              <StyledButtonIcon>
                <ServiceIcon width={20} height={20} />
              </StyledButtonIcon>
              {type === 'signup' ? 'Sign up' : 'Log in'} with {service.title}
            </>
            )
          : (
            <>
              <StyledButtonIcon>
                <PageLoading size={20} />
              </StyledButtonIcon>
              Connecting to {service.title}
            </>
            )}
      </StyledButton>
    </div>
  )
}
