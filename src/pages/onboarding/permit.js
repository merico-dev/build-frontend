import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import {
  Link,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import styled from '@emotion/styled'

import OnboardingButtons from '@/components/OnboardingButtons'
import { StyledOnboardingText } from '@/components/OnboardingText'
import { ReactComponent as Logo } from '@/images/logo-build.svg'
import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'
import { smMedia } from '@/styles/snippets/responsive'

import { SUCCEED } from '@/store/statusTypes'
import { MP, OnboardingEvents } from '@/utils/mixpanel'

import config from '../../../config/resolveConfig'

const StyledOnboardingProvider = styled.div`
  margin: 17% 0 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);

  ${smMedia(`
    margin: 17% 0 60px 0;
    color: var(--color-gray-400);
  `)}
`

const StyledOnboardingSeparator = styled.div`
  width: 75px;
  background-image: linear-gradient(to right,#b2b4bd 33%,rgba(255,255,255,0) 0%);
  background-position: bottom;
  background-size: 9px 2px;
  background-repeat: repeat-x;
  border-radius: 4px;
  margin: 0 18px;
  height: 2px;
`

const StyledPermitContainer = styled.div`
  margin-left: none;
  width: 222px;
  font-size: var(--text-xs);
  align-items: flex-end;
  color: var(--color-gray-500);
  cursor: pointer;
  margin-top: 20px;

  ${smMedia(`
    margin-left: auto;
    color: var(--color-gray-400);
    font-size: var(--text-xs);
  `)}
`

const brandProvider = (provider) => {
  switch (provider) {
    case 'github':
      return 'GitHub'
    case 'gitlab':
      return 'GitLab'
    default:
      return 'provider'
  }
}

export default function Permit () {
  const [loading, setLoading] = useState(false)
  const {
    provider
  } = useParams()
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user.status === SUCCEED && user.data.primaryEmail) {
      MP.identify(user.data.primaryEmail)
    } else {
      MP.identify(`MERICO-CE-NEW-USER-${Date.now()}`)
    }
  }, [user])

  if (!['github', 'gitlab'].includes(provider)) {
    return (<Redirect to='/' />)
  }
  const onConfirm = () => {
    window.location = `${config.apiUrl}/auth/${provider}?redirectBaseUrl=${config.frontendUrl}`
    setLoading(true)
    MP.track(OnboardingEvents.CONFIRMED, { provider: brandProvider(provider) })
  }

  return (
    <>
      <div style={{ height: '100%' }}>
        <StyledOnboardingText>
          Merico would like to access your {brandProvider(provider)} profile
          to set up your account.
        </StyledOnboardingText>
        <StyledOnboardingProvider>
          {provider === 'github' && (
            <Github width={isSmUp ? 63 : 42} height={isSmUp ? 63 : 42} />
          )}
          {provider === 'gitlab' && (
            <Gitlab width={isSmUp ? 63 : 42} height={isSmUp ? 63 : 42} />
          )}
          <StyledOnboardingSeparator />
          <Logo width='90' height='57' />
        </StyledOnboardingProvider>
        <StyledPermitContainer>
          <label
            htmlFor='permit'
          >
            By clicking “Confirm”, you accept our<br />
            <Link
              component='a'
              href='/terms'
              target='_blank'
              color='primary'
            >
              Terms and Conditions.
            </Link>
          </label>
        </StyledPermitContainer>
        <OnboardingButtons
          confirm={onConfirm}
          confirmText={loading ? `Connecting to ${provider}` : 'Confirm'}
          disabled={loading}
        />
      </div>
    </>
  )
}
