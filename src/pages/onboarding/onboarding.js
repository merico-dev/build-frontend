import React from 'react'
import Panel from '@/layouts/Panel'
import { Helmet } from 'react-helmet'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'

import Permit from '@/pages/onboarding/permit'
import SelectRepo from '@/pages/onboarding/select-repo'
import SecondaryEmails from '@/pages/onboarding/secondary-emails'
import MissingEmail from '@/pages/onboarding/missing-email'
import EmailVerification from '@/pages/onboarding/email-verification'
import { mdMedia, smMedia } from '@/styles/snippets/responsive'

const StyledOnboarding = styled.div`
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
`

const StyledTitle = styled.h1`
  color: var(--color-primary-400);
  font-size: var(--text-md);
  margin: 20px 0;

  ${smMedia(`
    font-size: var(--text-xxxl);
    margin: 70px 0 58px;
  `)}
`

const StyledOnboardingContent = styled.div`
  display: flex;
  flex-direction: column;

  ${smMedia(`
    display: grid;
    grid-template-columns: 163px 1fr;
  `)}
  ${mdMedia(`
    grid-template-columns: 290px 1fr;
  `)}
`

const StyledOnboardingTabContent = styled.div`
  min-height: 454px;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
  font-size: var(--text-xs);
  ${smMedia(`
    background: var(--color-background-orange-400);
    padding: 40px 64px;
  `)}
`

const StyledTabLink = styled.div`
  font-size: var(--text-xl);
  font-weight: var(--text-semibold);
  display: none;
  text-decoration: none;
  color: var(--color-gray-300);
  text-align: left;
  padding: 0 0 10px 0;

  &.selected {
    background: transparent;
    color: var(--color-gray-500);
    display: block;
  }

  ${smMedia(`
    padding: 20px 16px;
    font-size: 1.375rem;
    display: block;
    text-align: center;
    &.selected {
      background: var(--color-background-orange-400);
    }
  `)}
`

const StyledTabStep = styled.div`
  font-weight: 400;
  font-size: var(--text-xxs);
  text-align: left;

  ${smMedia(`
    font-size: var(--text-sm);
  `)}
`

const StyledOnboardingMenu = styled.div`
  /* display: none; */
  display: block;
  ${smMedia(`
    display: block;
  `)}
`

export default function Onboarding () {
  const user = useSelector((state) => state.user)
  const selectRepositoriesActive = useRouteMatch({
    path: '/onboarding/select-repositories/'
  })
  const secondaryEmailsActive = useRouteMatch({
    path: '/onboarding/secondary-emails/'
  })
  const onboardingActive = useRouteMatch({
    path: '/onboarding/:provider',
    exact: true
  }) && !selectRepositoriesActive && !secondaryEmailsActive
  const emailActive = useRouteMatch({
    path: '/onboarding/missing-email',
    exact: true
  })

  return (
    <Panel sidebar={false}>
      <Helmet>
        <title>Onboarding - Merico Build</title>
      </Helmet>
      <StyledOnboarding>
        <StyledTitle>
          Welcome to Merico Build!
        </StyledTitle>
        <StyledOnboardingContent>
          <StyledOnboardingMenu>
            <StyledTabLink
              className={(onboardingActive || emailActive) && 'selected'}
            >
              <StyledTabStep>Step 1/3</StyledTabStep>
              Create an Account
            </StyledTabLink>
            <StyledTabLink
              className={selectRepositoriesActive && 'selected'}
            >
              <StyledTabStep>Step 2/3</StyledTabStep>
              Add Repositories
            </StyledTabLink>
            <StyledTabLink
              className={secondaryEmailsActive && 'selected'}
            >
              <StyledTabStep>Step 3/3 (Optional)</StyledTabStep>
              Add Secondary E-mails
            </StyledTabLink>
          </StyledOnboardingMenu>
          <StyledOnboardingTabContent>
            <Switch>
              <Route path='/onboarding/missing-email' exact>
                <MissingEmail user={user} />
              </Route>
              <Route path='/onboarding/emailVerified'>
                <EmailVerification user={user} />
              </Route>
              <Route path='/onboarding/select-repositories/' exact>
                <SelectRepo user={user} />
              </Route>
              <Route path='/onboarding/secondary-emails/' exact>
                <SecondaryEmails user={user} />
              </Route>
              <Route path='/onboarding/:provider?'>
                <Permit user={user} />
              </Route>
            </Switch>
          </StyledOnboardingTabContent>
        </StyledOnboardingContent>
      </StyledOnboarding>
    </Panel>
  )
}
