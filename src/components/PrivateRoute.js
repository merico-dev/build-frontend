import React from 'react'
import { Route } from 'react-router-dom'

import HandlePrivateRedirect from '@/utils/developer/handlePrivateRedirect'
import config from '@config/resolveConfig'

export default function PrivateRoute ({ children, user, ...rest }) {
  const isAuthenticated = user.status === 'SUCCEED'

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) => (isAuthenticated
        ? children
        : (
          <HandlePrivateRedirect
            config={config}
            // isAuthenticated={isAuthenticated}
            location={location}
          />
          )
      )}
    />
  )
}
