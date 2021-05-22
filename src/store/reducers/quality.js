import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_OVERVIEW = '@quality/FETCH_OVERVIEW'
export const FETCH_RANKING = '@quality/FETCH_RANKING'

export const SET_OVERVIEW = '@quality/SET_OVERVIEW'
export const SET_RANKING = '@quality/SET_RANKING'

export const SET_OVERVIEW_STATUS = '@quality/SET_OVERVIEW_STATUS'
export const SET_RANKING_STATUS = '@quality/SET_RANKING_STATUS'

const initialState = {
  overview: {
    status: LOADING
  },
  ranking: {
    status: LOADING
  }
}

export default function QualityReducer (state = initialState, action) {
  switch (action.type) {
    case SET_OVERVIEW: {
      return {
        ...state,
        overview: {
          data: action.payload,
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
