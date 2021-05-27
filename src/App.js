import React, { useEffect, useRef, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useHistory
} from 'react-router-dom'
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux'
import { I18nProvider } from '@lingui/react'
import { i18nInstance } from '@/utils/i18n'
import { ThemeProvider } from '@material-ui/core'
import 'react-dates/initialize'
import { Readiness } from '@/enums/repositoryReadiness'

import theme from '@/config/theme'
import AppContext from '@/utils/AppContext'
import RepositoryUnavailable from '@/pages/repository-unavailable'
import Dashboard from '@/pages/dashboard'
import Repository from '@/pages/repository'
import Repositories from '@/pages/repositories'
import Badges from '@/pages/badges'
import Account from '@/pages/account'
import Privacy from '@/pages/privacy'
import Terms from '@/pages/terms'
import Contact from '@/pages/contact'
import Help from '@/pages/help'
import Team from '@/pages/team'
import Login from '@/pages/login'
import Profile from '@/pages/profile'
import ProfileContributor from '@/pages/profile/contributor.js'

import AuthPages from '@/pages/auth'
import MyProjects from '@/pages/projects'
import SessionUnauthorized from '@/pages/developer/session-unauthorized'

// import Home from '@/pages/home';
// NEW Beta Home DEC 17 Launch
import Home from '@/pages/homeBeta'
import Onboarding from '@/pages/onboarding/onboarding'
import MyContributions from '@/pages/my-contributions'

import en from '@/locales/en/messages.po'
import zh from '@/locales/zh/messages.po'

import { MP, AppEvents } from '@/utils/mixpanel'

import { FETCH_USER } from '@/store/reducers/user'
import store from './store'

import '@/styles/main.scss'
import FetchStatus from './components/FetchStatus'
import { SUCCEED, FAILED, LOADING } from './store/statusTypes'
import Error from './pages/error'
import { postData } from './utils/fetchData'

import PrivateRoute from '@/components/PrivateRoute'

function repositoryListUnavailable (repositories) {
  if (!repositories.data?.length) {
    return true
  }

  return !repositories.data.some(({ status, latestCommitHash }) => (
    status === Readiness.READY ||
    (
      status === Readiness.UNDERWAY && latestCommitHash
    )
  ))
}

/**
 * Update onboarded status on database without affecting current view
 */
const updateIsOnboarded = async () => {
  try {
    await postData('user/setIsOnboarded', { isOnboarded: true })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      'Unable to set is onboarded',
      e
    )
  }
}

function AppRoutes () {
  const {
    user,
    repositories: {
      list
    }
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const atDashboard = useRouteMatch('/dashboard')
  const atRepositories = useRouteMatch('/repositories')
  const atOnboarding = useRouteMatch('/onboarding')
  const atAccount = useRouteMatch('/account')
  const history = useHistory()
  const [stillOnboarding, setStillOnboarding] = useState(false)
  const onboardingOverrited = useRef(false)
  const [loginCompleted, setLoginCompleted] = useState(false)

  const trackVisit = (user, loginCompleted) => {
    if (user && user.status === SUCCEED && user.data && !loginCompleted) {
      const defaultName = 'User'
      const displayName = user.data.displayName !== null && user.data.displayName !== ''
        ? user.data.displayName
        : defaultName
      const nameParts = displayName !== null ? displayName.split(' ') : [defaultName]
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts[1] : ''
      MP.identify(user.data.primaryEmail)
      MP.profile(user.data.primaryEmail, displayName, firstName, lastName)
      MP.signup_profile({
        'Sign-Up Date': new Date(),
        Provider: user.data.githubUsername !== null ? 'Github' : 'Gitlab',
        Product: 'Merico Build (CE)',
        'Registration E-mail': user.data.primaryEmail
      })
      MP.track(AppEvents.VISIT_DASHBOARD, {})
      setLoginCompleted(true)
    } else {
      setLoginCompleted(false)
    }
  }

  useEffect(() => {
    dispatch({ type: FETCH_USER })
  }, [dispatch])

  useEffect(() => {
    if (!loginCompleted) {
      trackVisit(user, loginCompleted)
    }
    return () => {

    }
  }, [user, loginCompleted])

  useEffect(() => {
    if (
      user.status === SUCCEED &&
      user.data.isOnboarded !== true &&
      !atOnboarding &&
      !atAccount &&
      !list?.data?.length
    ) {
      setStillOnboarding(true)
    }
  }, [history, user, atOnboarding, atAccount, list])

  useEffect(() => {
    if (
      list?.data?.length &&
      user.data.isOnboarded === false &&
      onboardingOverrited.current === false
    ) {
      updateIsOnboarded(onboardingOverrited)
      onboardingOverrited.current = true
    }
  }, [user, list])

  if (
    // is onboarding
    (stillOnboarding && !atOnboarding) &&
    // is in a onboarding required route
    (atDashboard || atRepositories) &&
    // has no repositories
    !list?.data?.length
  ) {
    return (
      <Redirect to='/onboarding/select-repositories' />
    )
  }

  if (
    user.status === SUCCEED &&
    list.status === SUCCEED &&
    atDashboard &&
    repositoryListUnavailable(list)
  ) {
    return <RepositoryUnavailable repositories={list.data ?? []} />
  }

  if (
    (user.status === FAILED || user.status === LOADING) &&
    loginCompleted
  ) {
    setLoginCompleted(false)
  }

  return (
    user.status !== LOADING
      ? (
        <Switch>
          <Route
            path='/account/signed-out'
          >
            <Account />
          </Route>
          <Route
            path='/profile'
          >
            <Profile />
          </Route>
          <Route
            path='/contributor/profile'
          >
            <ProfileContributor />
          </Route>
          <PrivateRoute
            user={user}
            path='/repositories'
          >
            <Repositories />
          </PrivateRoute>
          <PrivateRoute
            user={user}
            path='/dashboard'
          >
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute
            user={user}
            path='/my-contributions'
          >
            <MyContributions />
          </PrivateRoute>
          <Route
            user={user}
            path='/projects'
          >
            <MyProjects />
          </Route>
          <PrivateRoute
            user={user}
            path='/repository'
          >
            <Repository />
          </PrivateRoute>
          <PrivateRoute
            user={user}
            path='/account'
          >
            <Account />
          </PrivateRoute>
          <Route
            path='/badges'
          >
            <Badges />
          </Route>
          <Route
            path='/onboarding'
          >
            <Onboarding />
          </Route>
          <Route path='/auth'><AuthPages /></Route>
          <Route path='/privacy'><Privacy /></Route>
          <Route path='/terms'><Terms /></Route>
          <Route path='/contact'><Contact /></Route>
          <Route path='/help'><Help /></Route>
          <Route path='/team'><Team /></Route>
          <Route
            path='/login'
            render={
          // eslint-disable-next-line react/jsx-props-no-spreading
          (props) => (<Login {...props} />)
        }
          />
          <Route exact path='/'><Home /></Route>
          <Route path='/developer/unauthorized'>
            <SessionUnauthorized title='Developer Mode' text='Session Unauthorized' />
          </Route>
          <Route><Error title='404' text='Page not found' /></Route>
        </Switch>
        )
      : (
        <FetchStatus
          status={user.status}
        />
        )
  )
}

function App () {
  const i18n = i18nInstance()

  return (
    <ReduxProvider store={store}>
      <AppContext.Provider value={{ i18n }}>
        <I18nProvider language='en' catalogs={{ en, zh }}>
          <ThemeProvider theme={theme}>
            <Router>
              <AppRoutes />
            </Router>
          </ThemeProvider>
        </I18nProvider>
      </AppContext.Provider>
    </ReduxProvider>
  )
}

export default App
