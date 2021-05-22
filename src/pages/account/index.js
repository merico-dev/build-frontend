import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Form from '@/pages/account/form'
import SignedOut from '@/pages/account/signed-out'
import Deleted from '@/pages/account/deleted'

export default function Account () {
  return (
    <Switch>
      <Route path='/account/signed-out' exact>
        <SignedOut />
      </Route>
      <Route path='/account/deleted' exact>
        <Deleted />
      </Route>
      <Route path='/account'>
        <Form />
      </Route>
    </Switch>
  )
}
