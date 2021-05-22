import React from 'react'
import { Helmet } from 'react-helmet'

import Message from '@/pages/message'

export default function Success () {
  return (
    <>
      <Helmet>
        <title>Success - Merico Build</title>
      </Helmet>
      <Message
        title='Thank you for contacting us. We will review your message with care.'
        btnLink='/'
        btnText='Back to Dashboard'
      />
    </>
  )
}
