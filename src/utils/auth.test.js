import { login } from './auth'
import config from '../../config/resolveConfig'
import Cookies from 'js-cookie'

const MOCK_TOKEN = 'MOCK_TOKEN'
const { location } = window

const mockLocation = (url, pathname, search) => {
  delete window.location

  window.location = {
    ...location,
    href: `${url}${pathname}${search}`,
    pathname,
    search,
    replace: jest.fn()
  }

  return window.location
}

describe('auth', () => {
  beforeEach(() => {
    window.location = location
  })

  describe('login', () => {
    it('returns false when not in /login', () => {
      expect(login()).toBe(false)
    })
    it('returns false when the tokn is missing from the url', () => {
      expect(login()).toBe(false)
    })
    it('returns false when the token is missing from the url', () => {
      const mockedLocation = mockLocation(`${config.frontendUrl}`, '/login')
      expect(login()).toBe(false)
      expect(mockedLocation.replace).not.toBeCalled()
    })
    it('updates the browser token', () => {
      mockLocation(`${config.frontendUrl}`, '/login', `?token=${MOCK_TOKEN}`)
      login()
      const savedToken = Cookies.get('ce-backend-jwt')
      expect(savedToken).toBe(MOCK_TOKEN)
    })
    it('redirects to dashboard when there is no redirect stored', () => {
      const mockedLocation = mockLocation(`${config.frontendUrl}`, '/login', `?token=${MOCK_TOKEN}`)
      login()
      expect(mockedLocation.replace).toBeCalledWith('/dashboard')
    })
    it('redirects to the given callback when there is a redirect stored', () => {
      window.localStorage.setItem('redirect', '/account')
      const mockedLocation = mockLocation(`${config.frontendUrl}`, '/login', `?token=${MOCK_TOKEN}`)
      login()
      expect(mockedLocation.replace).toBeCalledWith('/account')
    })
  })
})
