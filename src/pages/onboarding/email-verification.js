import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
import Cookies from 'js-cookie'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'

import OnboardingButtons from '@/components/OnboardingButtons'
import { StyledOnboardingText } from '@/components/OnboardingText'
import { FETCH_USER } from '@/store/reducers/user'
import { ReactComponent as Check } from '@/icons/check-circle.svg'

const StyledEmailTitle = styled.div`
  font-size: var(--text-xl);
  color: var(--color-gray-500);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledCheck = styled(Check)`
  width: 32px;
  height: 32px;
  color: #78D769;
  margin-right: 12px;
`

export default function EmailVerification () {
  const history = useHistory()
  const dispatch = useDispatch()

  const { token } = queryString.parse(window.location.search)

  useEffect(() => {
    const jtw = Cookies.get('ce-backend-jwt')
    if (jtw) return

    // store the token for all future requests
    Cookies.set('ce-backend-jwt', token, { path: '/' })
    dispatch({ type: FETCH_USER })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <StyledEmailTitle>
        <StyledCheck width='13' height='11' />
        Email verified!
      </StyledEmailTitle>
      <StyledOnboardingText />
      <OnboardingButtons
        back
        backDisabled
        confirm={() => history.replace('/onboarding/select-repositories')}
        confirmText='Continue'
      />
    </>
  )
}
