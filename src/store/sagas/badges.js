import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/badges'
import { fetchData } from '@/utils/fetchData'
import { FAILED, LOADING } from '@/store/statusTypes'

/**
 * Fetch badges
 */
export function * loadBadges () {
  yield put({
    type: ActionTypes.SET_BADGES_STATUS,
    payload: LOADING
  })
  try {
    const {
      data
    } = yield call(fetchData, '/badges')
    yield put({
      type: ActionTypes.SET_BADGES,
      payload: {
        data
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_BADGES_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch assertion
 */
export function * loadAssertion (action) {
  yield put({
    type: ActionTypes.SET_ASSERTION_STATUS,
    payload: LOADING
  })
  try {
    // @todo Update /badge API Endpoint on BE to respond with a "data" payload response key.
    const data = yield call(fetchData, `/badge/${action?.payload}`)
    yield put({
      type: ActionTypes.SET_ASSERTION,
      payload: {
        data
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_ASSERTION_STATUS,
      payload: FAILED
    })
  }
}

const BadgesSagas = [
  takeLatest(ActionTypes.FETCH_BADGES, loadBadges),
  takeLatest(ActionTypes.FETCH_ASSERTION, loadAssertion),
]

export default BadgesSagas
