import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/dashboardOverview'
import { fetchData } from '@/utils/fetchData'
import { LOADING, FAILED } from '@/store/statusTypes'

/**
 * Fetch user data
 */
export function * loadDashboardOverview (action) {
  yield put({
    type: ActionTypes.FETCH_DASHBOARD_OVERVIEW_STATUS,
    payload: LOADING
  })
  try {
    const { data = {} } = yield call(fetchData, '/dashboard/overview', action.payload)
    yield put({
      type: ActionTypes.SET_DASHBOARD_OVERVIEW,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_DASHBOARD_OVERVIEW_STATUS,
      payload: FAILED
    })
  }
}

const DashboardOverviewSagas = [
  takeLatest(ActionTypes.FETCH_DASHBOARD_OVERVIEW, loadDashboardOverview),
]

export default DashboardOverviewSagas
