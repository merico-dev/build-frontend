import PageLoading from '@/components/PageLoading'
import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import Error from '@/pages/error'

const ProfileHome = lazy(() => import('@/pages/profile/home'))

export default function Profile () {
  return (
    <Switch>
      <Route path='/profile/:id'>
        <Suspense fallback={<PageLoading />}>
          <ProfileHome />
        </Suspense>
      </Route>
      <Route>
        <Error text='Profile not found' />
      </Route>
    </Switch>
  )
}
