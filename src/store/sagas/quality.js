import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/quality'

import { fetchData } from '@/utils/fetchData'
import { FAILED, LOADING } from '@/store/statusTypes'

/**
 * Fetch quality data across time, including overview, test_coverage, doc_coverage,  modularity,
 * reusability, and others.
 */
export function * loadQualityOverview (action) {
  yield put({
    type: ActionTypes.SET_OVERVIEW_STATUS,
    payload: LOADING
  })
  try {
    const { data } = yield call(fetchData, 'reportMetrics', action?.payload)
    yield put({
      type: ActionTypes.SET_OVERVIEW,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_OVERVIEW_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch quality ranking data
 */
export function * loadQualityRanking (action) {
  yield put({
    type: ActionTypes.SET_RANKING_STATUS,
    payload: LOADING
  })
  try {
    const {
      data = [],
      contributors = 0
    } = yield call(fetchData, 'qualityRanking', action?.payload)
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

const qualitySagas = [
  takeLatest(ActionTypes.FETCH_OVERVIEW, loadQualityOverview),
  takeLatest(ActionTypes.FETCH_RANKING, loadQualityRanking),
]

export default qualitySagas
