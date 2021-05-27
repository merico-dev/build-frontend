import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Message from '@/pages/message'
import { FETCH_USER } from '@/store/reducers/user'
import { logout } from '@/utils/auth'

export default function Deleted () {
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    logout()
    return () => {
      dispatch({
        type: FETCH_USER,
        payload: {
          callback: () => {
            history.replace('/')
          }
        }
      })
    }
  }, [dispatch, history])
  return (
    <>
      <Helmet>
        <title>Deleted - Merico Build</title>
      </Helmet>
      <Message
        title='Your account has been successfully deleted.'
        btnLink='/'
        btnText='Go Back to Home'
        maxWidth='730px'
      />
    </>
  )
}
