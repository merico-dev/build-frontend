/* eslint-disable no-console */
import queryString from 'query-string'
import Cookies from 'js-cookie'
import { MP, AuthEvents } from '@/utils/mixpanel'
import { dashboardLink } from '@/utils/dashboardLink'

// @todo: Trap User Scope Provider (Gitlab vs Github)
const getRedirectAndClear = () => {
  const redirect = window.localStorage.getItem('redirect')

  if (redirect?.length > 0) {
    window.localStorage.removeItem('redirect')
    return redirect
  }

  return null
}

export const login = () => {
  if (!window.location.pathname.startsWith('/login')) {
    return false
  }

  const parsed = queryString.parse(window.location.href.split('?')[1])

  // only go on if a token was found
  if (!parsed?.token) {
    MP.track(AuthEvents.LOGIN_GITHUB_FAILED, {})
    return false
  }

  MP.track(AuthEvents.LOGIN_GITHUB, {})
  // store the token for all future requests
  Cookies.set('ce-backend-jwt', parsed.token, { path: '/' })

  window.location.replace(getRedirectAndClear('redirect') || dashboardLink())
  return true
}

export const logout = () => {
  Cookies.remove('ce-backend-jwt')
  Cookies.remove('ce-no-track')
  MP.track(AuthEvents.LOGOUT, {})
}
