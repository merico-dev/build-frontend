import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/impact'
import { fetchData } from '@/utils/fetchData'
import { FAILED, LOADING } from '@/store/statusTypes'

/**
 * Fetch impact overview data
 */
export function * loadImpactOverview (action) {
  yield put({
    type: ActionTypes.SET_OVERVIEW_STATUS,
    patload: LOADING
  })
  try {
    const { data, interval } = yield call(fetchData, 'impactOverview', action?.payload)
    yield put({
      type: ActionTypes.SET_OVERVIEW,
      payload: {
        data,
        interval
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_OVERVIEW_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch a list of commits with their impact
 */
export function * loadImpactCommits (action) {
  yield put({
    type: ActionTypes.SET_COMMITS_STATUS,
    patload: LOADING
  })
  try {
    const { data, totalRecords } = yield call(fetchData, 'impactCommits', action?.payload)
    yield put({
      type: ActionTypes.SET_COMMITS,
      payload: {
        data,
        totalRecords
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_COMMITS_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch impact ranking
 */
export function * loadImpactRanking (action) {
  yield put({
    type: ActionTypes.SET_RANKING_STATUS,
    patload: LOADING
  })
  try {
    const {
      data = [],
      contributors = 0
    } = yield call(fetchData, 'impactRanking', action?.payload)
    yield put({
      type: ActionTypes.SET_RANKING,
      payload: {
        data,
        contributors
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_RANKING_STATUS,
      payload: FAILED
    })
  }
}

const ImpactSagas = [
  takeLatest(ActionTypes.FETCH_OVERVIEW, loadImpactOverview),
  takeLatest(ActionTypes.FETCH_COMMITS, loadImpactCommits),
  takeLatest(ActionTypes.FETCH_RANKING, loadImpactRanking),
]

export default ImpactSagas
