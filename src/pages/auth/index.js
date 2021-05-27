import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router'

import PageLoading from '@/components/PageLoading'

const Rejected = lazy(() => import('@/pages/auth/rejected'))
const Cancelled = lazy(() => import('@/pages/auth/cancelled'))

export default function AuthRejected () {
  return (
    <Switch>
      <Route path='/auth/rejected/:provider?'>
        <Suspense fallback={<PageLoading />}>
          <Rejected />
        </Suspense>
      </Route>
      <Route path='/auth/cancelled'>
        <Suspense fallback={<PageLoading />}>
          <Cancelled />
        </Suspense>
      </Route>
    </Switch>
  )
}
