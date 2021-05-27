import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/productivity'
import { fetchData } from '@/utils/fetchData'

/**
 * Fetch productivity overview data
 */
export function * loadProductivityOverview (action) {
  yield put({ type: ActionTypes.FETCH_OVERVIEW_LOADING })
  try {
    const { data, interval } = yield call(fetchData, 'productivityOverview', action?.payload)
    yield put({
      type: ActionTypes.SET_OVERVIEW,
      payload: {
        data,
        interval
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_OVERVIEW_FAILED,
      payload: e.message
    })
  }
}

/**
 * Fetch productivity velocity data
 */
export function * loadProductivityVelocity (action) {
  yield put({ type: ActionTypes.FETCH_VELOCITY_LOADING })
  try {
    const { data, interval } = yield call(fetchData, 'productivityVelocity', action?.payload)
    yield put({
      type: ActionTypes.SET_VELOCITY,
      payload: {
        data,
        interval
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_VELOCITY_FAILED,
      payload: e.message
    })
  }
}

/**
 * Fetch productivity ranking data
 */
export function * loadProductivityRanking (action) {
  yield put({ type: ActionTypes.FETCH_RANKING_LOADING })
  try {
    const {
      data = [],
      contributors = 0
    } = yield call(fetchData, 'productivityRanking', action?.payload)
    yield put({
      type: ActionTypes.SET_RANKING,
      payload: {
        data,
        contributors
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_RANKING_FAILED,
      payload: e.message
    })
  }
}

const ProductivitySagas = [
  takeLatest(ActionTypes.FETCH_OVERVIEW, loadProductivityOverview),
  takeLatest(ActionTypes.FETCH_VELOCITY, loadProductivityVelocity),
  takeLatest(ActionTypes.FETCH_RANKING, loadProductivityRanking),
]

export default ProductivitySagas
