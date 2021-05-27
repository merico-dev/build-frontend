import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/projectProfile'
import { fetchData } from '@/utils/fetchData'
import { LOADING, FAILED } from '@/store/statusTypes'

export function * loadProjectProfile (action) {
  yield put({
    type: ActionTypes.FETCH_PROJECT_PROFILE_STATUS,
    payload: LOADING
  })
  try {
    const {
      data = {}
    } = yield call(fetchData, '/projects/public-profile', action.payload)
    yield put({
      type: ActionTypes.SET_PROJECT_PROFILE,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_PROJECT_PROFILE_STATUS,
      payload: FAILED
    })
  }
}

const ProjectProfileSagas = [
  takeLatest(ActionTypes.FETCH_PROJECT_PROFILE, loadProjectProfile),
]

export default ProjectProfileSagas
