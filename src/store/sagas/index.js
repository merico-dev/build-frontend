import { all } from 'redux-saga/effects'

import productivitySagas from '@/store/sagas/productivity'
import impactSagas from '@/store/sagas/impact'
import qualitySagas from '@/store/sagas/quality'
import repositoriesSagas from '@/store/sagas/repositories'
import userSagas from '@/store/sagas/user'
import dashboardSagas from '@/store/sagas/dashboard'
import badgesSagas from '@/store/sagas/badges'
import profileSagas from '@/store/sagas/profile'
import dashboardOverviewSagas from '@/store/sagas/dashboardOverview'
import projectsSagas from '@/store/sagas/projects'
import mergeRequestsSagas from '@/store/sagas/mergeRequests'
import projectProfileSagas from '@/store/sagas/projectProfile'

/**
 * Yields all created sagas so they can be called in react components
 */
export default function * rootSaga () {
  yield all([
    ...productivitySagas,
    ...impactSagas,
    ...qualitySagas,
    ...repositoriesSagas,
    ...userSagas,
    ...dashboardSagas,
    ...badgesSagas,
    ...profileSagas,
    ...dashboardOverviewSagas,
    ...projectsSagas,
    ...mergeRequestsSagas,
    ...projectProfileSagas
  ])
}
