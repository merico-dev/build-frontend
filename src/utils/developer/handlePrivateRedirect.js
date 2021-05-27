import React from 'react'
import {
  Redirect
} from 'react-router-dom'

export default function HandlePrivateRedirect (props) {
  const {
    config,
    // isAuthenticated,
    location,
    // children
  } = props

  const devOptions = config.developer ?? false
  // const [openDeveloperNotice, setOpenDeveloperNotice] = React.useState(true);
  // setOpenDeveloperNotice(true);

  return devOptions && devOptions.noRedirectOnAuthFail
    ? (
      <>
        <Redirect to={`/developer/unauthorized/?dest=${location.pathname}`} />
      </>
      )
    : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location }
        }}
      />
      )
}
