import React from 'react'
import { Route, Switch } from 'react-router'

import Panel from '@/layouts/Panel'
import ErrorBoundary from '@/components/ErrorBoundary'
import Progress from '@/pages/my-contributions/progress'
import Ranking from '@/pages/next-gen-dashboard/ranking'

function MyContributions () {
  return (
    <Switch>
      <Route path='/my-contributions/progress'>
        <Progress />
      </Route>
      <Route path='/my-contributions/ranking'>
        <Ranking />
      </Route>
    </Switch>
  )
}

export default function BoundedMyContributions () {
  return (
    <Panel>
      <ErrorBoundary>
        <MyContributions />
      </ErrorBoundary>
    </Panel>
  )
}
