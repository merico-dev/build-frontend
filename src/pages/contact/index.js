import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Form from '@/pages/contact/form'
import Success from '@/pages/contact/success'

export default function Contact () {
  return (
    <Switch>
      <Route path='/contact/success' exact>
        <Success />
      </Route>
      <Route path='/contact'>
        <Form />
      </Route>
    </Switch>
  )
}
