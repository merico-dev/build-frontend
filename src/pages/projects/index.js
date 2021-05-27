import React from 'react'
import { Route, Switch } from 'react-router'
import { useSelector } from 'react-redux'

import PrivateRoute from '@/components/PrivateRoute'
import Repositories from '@/pages/projects/repositories'
import Repository from '@/pages/projects/repository'

export default function Projects () {
  const {
    user
  } = useSelector((state) => state)

  return (
    <Switch>
      <PrivateRoute
        user={user}
        path='/projects/repositories'
      >
        <Repositories />
      </PrivateRoute>
      <Route path='/projects/repository'>
        <Repository />
      </Route>
    </Switch>
  )
}
