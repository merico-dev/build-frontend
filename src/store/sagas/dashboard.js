import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '@/store/reducers/dashboard'
import * as RepositoriesActionTypes from '@/store/reducers/repositories'
import { fetchData, postData } from '@/utils/fetchData'
import { FAILED, LOADING, SUCCEED } from '@/store/statusTypes'

/**
 * Fetch top achievements data
 */
export function * loadTopAchievements () {
  try {
    yield put({
      type: ActionTypes.SET_TOP_ACHIEVEMENTS_STATUS,
      payload: LOADING
    })
    const {
      data
    } = yield call(fetchData, '/topAchievements')
    yield put({
      type: ActionTypes.SET_TOP_ACHIEVEMENTS,
      payload: {
        data
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_TOP_ACHIEVEMENTS_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch top contributions data
 */
export function * loadTopContributions () {
  try {
    const { data } = yield call(fetchData, '/topContributions')
    yield put({
      type: ActionTypes.SET_TOP_CONTRIBUTIONS,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_TOP_CONTRIBUTIONS_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch Dev Share for multiple teams across time
 */
export function * loadDevValueByTeam (action) {
  yield put({
    type: ActionTypes.SET_DEV_VALUE_BY_TEAM_STATUS,
    payload: LOADING
  })
  try {
    const { data } = yield call(fetchData, '/devValueByTeam', action?.payload)
    yield put({
      type: ActionTypes.SET_DEV_VALUE_BY_TEAM,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_DEV_VALUE_BY_TEAM_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch Dev Share ranking for multiple teams for the current date
 */
export function * loadDevValueByRanking (action) {
  yield put({
    type: ActionTypes.SET_DEV_VALUE_BY_TEAM_RANKING_STATUS,
    payload: LOADING
  })
  try {
    const { data } = yield call(fetchData, '/devValueByRanking', action?.payload)
    yield put({
      type: ActionTypes.SET_DEV_VALUE_BY_TEAM_RANKING,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_DEV_VALUE_BY_TEAM_RANKING_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch Dev Share ranking for multiple teams across time
 */
export function * loadDevValueByRankingProgress (action) {
  try {
    const {
      data,
      contributors,
      dates
    } = yield call(fetchData, '/devValueByRankingProgress', action?.payload)
    yield put({
      type: ActionTypes.SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS,
      payload: {
        data,
        contributors,
        dates
      }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS_STATUS,
      payload: FAILED
    })
  }
}

/**
 * save repository list from dashboard
 */
export function * saveDashboardRepositories (action) {
  yield put({
    type: ActionTypes.SET_SAVE_REPOSITORIES_STATUS,
    payload: LOADING
  })
  try {
    yield put({
      type: ActionTypes.SET_SAVE_REPOSITORIES_STATUS,
      payload: SUCCEED
    })
    yield call(postData, 'setFavoriteRepos', { projects: action.payload.projects })
    yield put({
      type: RepositoriesActionTypes.SET_LIST_DATA,
      payload: { data: action.payload.projects }
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_SAVE_REPOSITORIES_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch productivity overview
 */
export function * loadProductivityOverview (action) {
  yield put({
    type: ActionTypes.SET_PRODUCTIVITY_OVERVIEW_STATUS,
    payload: LOADING
  })
  try {
    const {
      data
    } = yield call(fetchData, '/multipleProductivityOverview', action?.payload)
    yield put({
      type: ActionTypes.SET_PRODUCTIVITY_OVERVIEW,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_PRODUCTIVITY_OVERVIEW_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch imapct overview
 */
export function * loadImpactOverview (action) {
  yield put({
    type: ActionTypes.SET_IMPACT_OVERVIEW_STATUS,
    payload: LOADING
  })
  try {
    const {
      data
    } = yield call(fetchData, '/multipleImpactOverview', action?.payload)
    yield put({
      type: ActionTypes.SET_IMPACT_OVERVIEW,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_IMPACT_OVERVIEW_STATUS,
      payload: FAILED
    })
  }
}

/**
 * Fetch quality overview
 */
export function * loadQualityOverview (action) {
  yield put({
    type: ActionTypes.SET_QUALITY_OVERVIEW_STATUS,
    payload: LOADING
  })
  try {
    const {
      data
    } = yield call(fetchData, '/multipleReportMetrics', action?.payload)
    yield put({
      type: ActionTypes.SET_QUALITY_OVERVIEW,
      payload: data
    })
  } catch (e) {
    yield put({
      type: ActionTypes.SET_QUALITY_OVERVIEW_STATUS,
      payload: FAILED
    })
  }
}

const DashboardSagas = [
  takeLatest(ActionTypes.FETCH_TOP_ACHIEVEMENTS, loadTopAchievements),
  takeLatest(ActionTypes.FETCH_TOP_CONTRIBUTIONS, loadTopContributions),
  takeLatest(ActionTypes.FETCH_DEV_VALUE_BY_TEAM, loadDevValueByTeam),
  takeLatest(ActionTypes.FETCH_DEV_VALUE_BY_TEAM_RANKING, loadDevValueByRanking),
  takeLatest(ActionTypes.FETCH_DEV_VALUE_BY_TEAM_RANKING_PROGRESS, loadDevValueByRankingProgress),
  takeLatest(ActionTypes.FETCH_PRODUCTIVITY_OVERVIEW, loadProductivityOverview),
  takeLatest(ActionTypes.FETCH_IMPACT_OVERVIEW, loadImpactOverview),
  takeLatest(ActionTypes.FETCH_QUALITY_OVERVIEW, loadQualityOverview),
  takeLatest(ActionTypes.SAVE_REPOSITORIES, saveDashboardRepositories)
]

export default DashboardSagas
