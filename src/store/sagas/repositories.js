import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/repositories'
import { fetchData, postData, deleteData } from '@/utils/fetchData'
import {
  LOADING,
  SUCCEED,
  FAILED
} from '../statusTypes'

/**
 * fetch user's github public repositories
 */
export function * loadGithubRepos () {
  yield put({
    type: ActionTypes.FETCH_GITHUB_REPOS_LOADING
  })
  try {
    const { data } = yield call(fetchData, 'repos/github', { start: 0, count: 10 })
    yield put({
      type: ActionTypes.SET_GITHUB_REPOS,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_GITHUB_REPOS_FAILED,
      payload: e.message
    })
  }
}

/**
 * fetch user's gitlab public repositories
 */
export function * loadGitlabRepos () {
  try {
    const { data } = yield call(fetchData, 'repos/gitlab', { start: 0, count: 10 })
    yield put({
      type: ActionTypes.SET_GITLAB_REPOS,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_GITLAB_REPOS_FAILED,
      payload: e.message
    })
  }
}

/**
 * fetch user's registered repositories
 */
export function * loadRepositoriesList (action) {
  try {
    const {
      data,
      totalRecords
    } = yield call(fetchData, 'projects', {
      sortColumn: action.payload?.sortColumn,
      sortDirection: action.payload?.sortDirection,
      start: action.payload?.start || 0,
      count: action.payload?.count || 1000
    })
    yield put({
      type: ActionTypes.SET_LIST,
      payload: {
        data,
        totalRecords
      }
    })

    // callback
    if (action?.payload?.callback) {
      yield put(action.payload.callback)
    }
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_LIST_FAILED,
      payload: e.message
    })
  }
}

/**
 * fetch user's registered repositories
 */
export function * loadRepositoriesPageList (action) {
  yield put({
    type: ActionTypes.FETCH_REPO_PAGE_LIST_STATUS,
    payload: LOADING
  })
  try {
    const {
      data,
      totalRecords
    } = yield call(fetchData, 'projects', {
      sortColumn: action.payload?.sortColumn,
      sortDirection: action.payload?.sortDirection,
      start: action.payload?.start || 0,
      count: action.payload?.count || 1000
    })
    yield put({
      type: ActionTypes.SET_REPO_PAGE_LIST,
      payload: {
        data,
        totalRecords
      }
    })

    // callback
    if (action?.payload?.callback) {
      yield put(action.payload.callback)
    }
  } catch (e) {
    yield put({
      type: ActionTypes.FETCH_REPO_PAGE_LIST_STATUS,
      payload: FAILED
    })
  }
}

/**
 * send repository for analysis
 */
export function * analyzeRepo (action) {
  try {
    const { data } = yield call(fetchData, 'repo/analyze', action?.payload)
    yield put({
      type: ActionTypes.ANALYZE_REPO_SET,
      payload: data,
    })
    yield put({
      type: ActionTypes.FETCH_LIST
    })
  } catch (e) {
    yield put({
      type: ActionTypes.ANALYZE_REPO_FAILED,
      payload: e.message
    })
  }
}

/**
 * add repository to user account
 */
export function * addRepositories (action) {
  yield put({
    type: ActionTypes.SET_ADD_REPOSITORIES_RESPONSE,
    payload: null
  })
  try {
    const response = yield call(postData, 'projects', { projects: action.payload })
    // TODO: Remove refresh of data and substitute with manual push
    yield put({
      type: ActionTypes.FETCH_LIST,
      payload: {
        callback: {
          type: ActionTypes.SET_ADD_REPOSITORIES_RESPONSE,
          payload: response
        }
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_ADD_REPOSITORIES_RESPONSE,
      payload: []
    })
  }
}

/**
 * delete repositories from user account
 */
export function * deleteRepositories (action) {
  yield put({
    type: ActionTypes.SET_DELETE_REPOSITORIES_STATUS,
    payload: LOADING
  })
  try {
    yield call(deleteData, 'projects', { gitUrls: action.payload.gitUrls })

    // callback
    if (action?.payload?.callback) {
      yield put(action.payload.callback)
    }
    yield put({
      type: ActionTypes.SET_DELETE_REPOSITORIES_STATUS,
      payload: SUCCEED
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_DELETE_REPOSITORIES_STATUS,
      payload: FAILED
    })
  }
}

const RepositoriesSagas = [
  takeLatest(ActionTypes.FETCH_GITLAB_REPOS, loadGitlabRepos),
  takeLatest(ActionTypes.FETCH_GITHUB_REPOS, loadGithubRepos),
  takeLatest(ActionTypes.FETCH_LIST, loadRepositoriesList),
  takeLatest(ActionTypes.FETCH_REPO_PAGE_LIST, loadRepositoriesPageList),
  takeLatest(ActionTypes.ANALYZE_REPO, analyzeRepo),
  takeLatest(ActionTypes.ADD_REPOSITORIES, addRepositories),
  takeLatest(ActionTypes.DELETE_REPOSITORIES, deleteRepositories)
]

export default RepositoriesSagas
