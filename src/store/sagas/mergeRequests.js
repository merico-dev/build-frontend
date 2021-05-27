import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/mergeRequests'

import { fetchData } from '@/utils/fetchData'
import { FAILED, LOADING } from '@/store/statusTypes'

export function * mergesRequests (action) {
  yield put({
    type: ActionTypes.SET_MERGE_REQUESTS_STATUS,
    payload: LOADING
  })
  try {
    const { data, interval } = yield call(fetchData, 'pull-requests/stats', action?.payload)
    yield put({
      type: ActionTypes.SET_MERGE_REQUESTS,
      payload: {
        stats: data.stats,
        interval
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_MERGE_REQUESTS_STATUS,
      payload: FAILED
    })
  }
}

const mergeRequestsSagas = [
  takeLatest(ActionTypes.FETCH_MERGE_REQUESTS, mergesRequests),
]

export default mergeRequestsSagas
