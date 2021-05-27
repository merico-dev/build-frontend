import React, { lazy, Suspense } from 'react'
import {
  Route,
  Switch,
  useRouteMatch,
  Redirect
} from 'react-router-dom'

import PageLoading from '@/components/PageLoading'
import Panel from '@/layouts/Panel'

const Overview = lazy(() => import('@/pages/dashboard/overview'))
// LEGACY HOME (DISABLED)
// const Home = lazy(() => import('@/pages/dashboard/home'))
const Quality = lazy(() => import('@/pages/dashboard/quality'))
const Productivity = lazy(() => import('@/pages/dashboard/productivity'))
const Impact = lazy(() => import('@/pages/dashboard/impact'))
const Ranking = lazy(() => import('@/pages/next-gen-dashboard/ranking'))

export default function Dashboard () {
  const { path } = useRouteMatch()

  return (
    <Panel>
      <Switch>
        <Route path={`${path}/overview`}>
          <Suspense fallback={<PageLoading />}>
            <Overview />
          </Suspense>
        </Route>
        <Route path={`${path}/ranking`}>
          <Suspense fallback={<PageLoading />}>
            <Ranking />
          </Suspense>
        </Route>
        <Route path={`${path}/quality`}>
          <Suspense fallback={<PageLoading />}>
            <Quality />
          </Suspense>
        </Route>
        <Route path={`${path}/productivity`}>
          <Suspense fallback={<PageLoading />}>
            <Productivity />
          </Suspense>
        </Route>
        <Route path={`${path}/impact`}>
          <Suspense fallback={<PageLoading />}>
            <Impact />
          </Suspense>
        </Route>
        <Route path={`${path}/`}>
          <Suspense fallback={<PageLoading />}>
            <Redirect to={`${path}/overview`} />
          </Suspense>
        </Route>
      </Switch>
    </Panel>
  )
}
