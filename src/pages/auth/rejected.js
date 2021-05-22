import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'

import Message from '@/pages/message'
import Panel from '@/layouts/Panel'
import ErrorBoundary from '@/components/ErrorBoundary'

function AuthRejected () {
  let { provider } = useParams()

  if (!['github', 'gitlab'].includes(provider)) {
    provider = 'github'
  }

  return (
    <div>
      <Helmet>
        <title>Auth Rejected - Merico Build</title>
      </Helmet>
      <Message
        title={
          <>
            We will need your authorization to analyze your repositories.<br />
            Do you want to try again?
          </>
        }
        btnLink={`/onboarding/${provider}/permit`}
        btnText='Try again'
        maxWidth='865px'
        secondaryBtnText='Cancel'
        secondaryBtnLink='/auth/cancelled'
        panel={false}
      />
    </div>
  )
}

export default function BoundedAuthRejected () {
  return (
    <>
      <Helmet>
        <title>Auth Rejected - Merico Build</title>
      </Helmet>
      <Panel sidebar={false} topbarProps={{ isPublic: false }}>
        <ErrorBoundary>
          <AuthRejected />
        </ErrorBoundary>
      </Panel>
    </>
  )
}
