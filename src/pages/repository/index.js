import React, { lazy, Suspense } from 'react'
import {
  Route,
  Switch,
  useRouteMatch
} from 'react-router-dom'

import PageLoading from '@/components/PageLoading'
import Panel from '@/layouts/Panel'

const Overview = lazy(() => import('@/pages/repository/overview'))

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
      </Switch>
    </Panel>
  )
}
