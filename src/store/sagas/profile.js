import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/profile'
import { fetchData } from '@/utils/fetchData'
import { LOADING, FAILED } from '../statusTypes'

/**
 * Fetch user data
 */
export function * loadProfile (action) {
  yield put({
    type: ActionTypes.FETCH_PROFILE_STATUS,
    payload: LOADING
  })
  try {
    const data = yield call(fetchData, `/publicProfile/${action.payload.id}`)
    yield put({
      type: ActionTypes.SET_PROFILE,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_PROFILE_STATUS,
      payload: FAILED
    })
  }
}

const ProfileSagas = [
  takeLatest(ActionTypes.FETCH_PROFILE, loadProfile),
]

export default ProfileSagas
