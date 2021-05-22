import React, { useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'

import { logout } from '@/utils/auth'
import Message from '@/pages/message'
import { LOGOUT_USER } from '@/store/reducers/user'

export default function Success () {
  const dispatch = useDispatch()
  const [signedOut, setSignedOut] = useState(false)
  const isMountedRef = useRef(false)

  const logoutUser = () => {
    setSignedOut(true)
    dispatch({
      type: LOGOUT_USER,
      payload: []
    })
  }

  useEffect(() => {
    isMountedRef.current = true
    if (isMountedRef.current && !signedOut) {
      logout()
      logoutUser()
    }

    return () => {
      isMountedRef.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Helmet>
        <title>Signed Out - Merico Build</title>
      </Helmet>
      <Message
        title='You are now signed out.'
        btnLink='/'
        btnText='Go back to Home'
        maxWidth='600px'
      />
    </>
  )
}
