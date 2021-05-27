import axios from 'axios'
import Cookies from 'js-cookie'
import config from '../../config/resolveConfig'

const UNAUTHORIZED_STATUS_CODE = 401

const isUserDataRequest = (url) => {
  return url.split('/').pop() === 'me'
}

// add interceptor to handle error responses
axios.interceptors.response.use(null, (error) => {
  // redirect user if backed returns unauthorized
  if (
    error.response.status === UNAUTHORIZED_STATUS_CODE &&
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/' &&
    !isUserDataRequest(error.request.responseURL)
  ) {
    window.location = '/login'
  }

  return Promise.reject(error)
})

/**
 * http
 *
 * @description Drop-in class for axios that handles authentication and base URL selection.
 */
const http = {
  /**
   * request
   *
   * @description Sends an axios request with appended authentication header.
   *
   * @param {string}  route           Route to be appended to API base URL (from Connection_url).
   * @param {string}  method          Type of request (get, post, delete, patch, etc.)
   * @param {Object}  [body={}]       Request body
   * @param {Object}  [headers={}]    Request headers
   */
  request: (route, method, body = null, headers = {}, useAuth = true, payloadKey = 'data') => {
    const token = Cookies.get('ce-backend-jwt')
    if (useAuth) {
      if (token === '') {
        throw new Error('Request failed: no token set in auth.')
      }
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = `Bearer ${token}`
    }

    // Compile request data.
    const reqData = {
      baseURL: config.apiUrl,
      url: route,
      method: method,
      headers: headers,
      [payloadKey]: body
    }
    return axios(reqData)
  },

  get: (route, query = {}, headers = {}, useAuth = true) => {
    return http.request(route, 'GET', query, headers, useAuth, 'params')
  },

  post: (route, body = {}, headers = {}, useAuth = true) => {
    return http.request(route, 'POST', body, headers, useAuth)
  },

  patch: (route, body = {}, headers = {}, useAuth = true) => {
    return http.request(route, 'PATCH', body, headers, useAuth)
  },

  put: (route, body = {}, headers = {}, useAuth = true) => {
    return http.request(route, 'PUT', body, headers, useAuth)
  },

  delete: (route, body = {}, headers = {}, useAuth = true) => {
    return http.request(route, 'DELETE', body, headers, useAuth)
  },

}

export default http
