import { combineReducers } from 'redux'
import productivity from './productivity'
import impact from './impact'
import quality from './quality'
import repositories from './repositories'
import user from './user'
import dashboard from './dashboard'
import badges from './badges'
import profile from './profile'
import projects from './projects'
import dashboardOverview from './dashboardOverview'
import mergeRequests from './mergeRequests'
import projectProfile from './projectProfile'

export default combineReducers({
  productivity,
  impact,
  quality,
  repositories,
  user,
  dashboard,
  badges,
  profile,
  dashboardOverview,
  projects,
  mergeRequests,
  projectProfile
})
