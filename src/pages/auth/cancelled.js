import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router'

import Message from '@/pages/message'
import Panel from '@/layouts/Panel'
import ErrorBoundary from '@/components/ErrorBoundary'
import StyledLink from '@/components/StyledLink'

function Cancelled () {
  const history = useHistory()

  useEffect(() => {
    const timeout = window.setTimeout(() => history.push('/'), 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [history])

  return (
    <div>
      <Helmet>
        <title>Auth Rejected - Merico Build</title>
      </Helmet>
      <Message
        title='You are being redirected to Merico Build homepage.'
        text={
          <>
            If your browser does not redirect you back,
            please <StyledLink to='/'>click here</StyledLink> to continue.
          </>
        }
        btnLink='/onboarding/github/permit'
        maxWidth='865px'
        panel={false}
      />
    </div>
  )
}

export default function BoundedCancelled () {
  return (
    <>
      <Helmet>
        <title>Auth Rejected - Merico Build</title>
      </Helmet>
      <Panel sidebar={false} topbarProps={{ isPublic: false }}>
        <ErrorBoundary>
          <Cancelled />
        </ErrorBoundary>
      </Panel>
    </>
  )
}
