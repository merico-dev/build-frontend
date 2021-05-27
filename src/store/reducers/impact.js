import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_OVERVIEW = '@impact/FETCH_OVERVIEW'
export const FETCH_COMMITS = '@impact/FETCH_COMMITS'
export const FETCH_RANKING = '@impact/FETCH_RANKING'

export const SET_OVERVIEW = '@impact/SET_OVERVIEW'
export const SET_COMMITS = '@impact/SET_COMMITS'
export const SET_RANKING = '@impact/SET_RANKING'

export const SET_OVERVIEW_STATUS = '@impact/SET_OVERVIEW_STATUS'
export const SET_COMMITS_STATUS = '@impact/SET_COMMITS_STATUS'
export const SET_RANKING_STATUS = '@impact/SET_RANKING_STATUS'

const initialState = {
  overview: {
    status: LOADING
  },
  commits: {
    status: LOADING
  },
  ranking: {
    status: LOADING
  }
}

export default function ImpactReducer (state = initialState, action) {
  switch (action.type) {
    case SET_OVERVIEW: {
      return {
        ...state,
        overview: {
          data: action.payload.data,
          interval: action.payload.interval,
          status: SUCCEED
        }
      }
    }
    case SET_OVERVIEW_STATUS: {
      return {
        ...state,
        overview: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_COMMITS: {
      return {
        ...state,
        commits: {
          data: action.payload.data,
          totalRecords: action.payload.totalRecords,
          status: SUCCEED
        }
      }
    }
    case SET_COMMITS_STATUS: {
      return {
        ...state,
        commits: {
          data: [],
          totalRecords: 0,
          status: action.payload
        }
      }
    }
    case SET_RANKING: {
      return {
        ...state,
        ranking: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case SET_RANKING_STATUS: {
      return {
        ...state,
        ranking: {
          data: [],
          status: action.payload
        }
      }
    }
    default: {
      return state
    }
  }
}
