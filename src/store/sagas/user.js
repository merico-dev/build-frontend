import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/user'
import * as RepositoriesActionTypes from '@/store/reducers/repositories'
import { fetchData } from '@/utils/fetchData'
import { LOADING, SUCCEED, FAILED } from '../statusTypes'

/**
 * Fetch user data
 */
export function * loadUser (action) {
  yield put({
    type: ActionTypes.SET_FETCH_USER_STATUS,
    payload: LOADING
  })
  try {
    const {
      user,
      repos
    } = yield call(fetchData, '/me')
    yield put({
      type: ActionTypes.SET_USER,
      payload: user
    })
    yield put({
      type: RepositoriesActionTypes.SET_LIST,
      payload: {
        data: repos,
        totalRecords: repos.length
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_USER_FAILED,
      payload: e.message
    })
  }

  // callback
  if (action?.payload?.callback) {
    if (typeof action.payload.callback === 'function') {
      action.payload.callback()
    } else {
      yield put(action.payload.callback)
    }
  }
}

/**
 * Sync github emails
 */
export function * syncGithub () {
  yield put({
    type: ActionTypes.SET_SYNC_GITHUB_STATUS,
    payload: LOADING
  })
  try {
    yield call(fetchData, '/syncGithub')
    yield put({
      type: ActionTypes.SET_SYNC_GITHUB_STATUS,
      payload: SUCCEED
    })
    yield put({
      type: ActionTypes.FETCH_USER
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_SYNC_GITHUB_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Sync gitlab emails
 */
export function * syncGitlab () {
  yield put({
    type: ActionTypes.SET_SYNC_GITLAB_STATUS,
    payload: LOADING
  })
  try {
    yield call(fetchData, '/syncGitlab')
    yield put({
      type: ActionTypes.SET_SYNC_GITLAB_STATUS,
      payload: SUCCEED
    })
    yield put({
      type: ActionTypes.FETCH_USER
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_SYNC_GITLAB_STATUS,
      payload: FAILED
    })
  }
}

/**
 * LogOut User (Reset User State)
 */
export function * logoutUser (action) {
  try {
    yield put({
      type: ActionTypes.SET_LOGOUT_USER,
      payload: action.payload
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_LOGOUT_USER,
      payload: FAILED
    })
  }
}

const UserSagas = [
  takeLatest(ActionTypes.FETCH_USER, loadUser),
  takeLatest(ActionTypes.SYNC_GITHUB, syncGithub),
  takeLatest(ActionTypes.SYNC_GITLAB, syncGitlab),
  takeLatest(ActionTypes.LOGOUT_USER, logoutUser)
]

export default UserSagas
