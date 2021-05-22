import React, { lazy, Suspense } from 'react'
import {
  Route,
  Switch,
  useRouteMatch
} from 'react-router-dom'
import styled from '@emotion/styled'

import PageLoading from '@/components/PageLoading'
import Panel from '@/layouts/Panel'
import { mdMedia } from '@/styles/snippets/responsive'
import ErrorBoundary from '@/components/ErrorBoundary'

const StyledContainer = styled.div`
  padding: 26px 20px;
  height: 100%;

  ${mdMedia(`
    padding: 40px 50px;
  `)}
`

const Main = lazy(() => import('@/pages/badges/main'))
const BadgeTypes = lazy(() => import('@/pages/badges/badge-types'))
const Issuer = lazy(() => import('@/pages/badges/issuer'))
const Assertion = lazy(() => import('@/pages/badges/assertion'))

export default function Dashboard () {
  const { path } = useRouteMatch()
  const isPrivate = useRouteMatch({
    path: '/badges',
    exact: true
  })

  return (
    <Panel sidebar={isPrivate}>
      <StyledContainer>
        <ErrorBoundary>
          <Switch>
            <Route path={`${path}/issuer/:id`}>
              <Suspense fallback={<PageLoading />}>
                <Issuer />
              </Suspense>
            </Route>
            <Route path={`${path}/assertion/:id`}>
              <Suspense fallback={<PageLoading />}>
                <Assertion />
              </Suspense>
            </Route>
            <Route path={`${path}/types`}>
              <Suspense fallback={<PageLoading />}>
                <BadgeTypes />
              </Suspense>
            </Route>
            <Route path={`${path}/`}>
              <Suspense fallback={<PageLoading />}>
                <Main />
              </Suspense>
            </Route>
          </Switch>
        </ErrorBoundary>
      </StyledContainer>
    </Panel>
  )
}
