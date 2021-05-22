import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/projects'

import { fetchData } from '@/utils/fetchData'
import { FAILED, LOADING } from '@/store/statusTypes'

export function * loadProjects (action) {
  yield put({
    type: ActionTypes.SET_PROJECTS_STATUS,
    payload: LOADING
  })
  try {
    const data = yield call(fetchData, 'my-projects', action?.payload)
    yield put({
      type: ActionTypes.SET_PROJECTS,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_PROJECTS_STATUS,
      payload: FAILED
    })
  }
}

const projectsSagas = [
  takeLatest(ActionTypes.FETCH_PROJECTS, loadProjects),
]

export default projectsSagas
