import {
  FAILED,
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_OVERVIEW = '@productivity/FETCH_OVERVIEW'
export const FETCH_RANKING = '@productivity/FETCH_RANKING'
export const FETCH_VELOCITY = '@productivity/FETCH_VELOCITY'

export const FETCH_OVERVIEW_LOADING = '@productivity/FETCH_OVERVIEW_LOADING'
export const FETCH_VELOCITY_LOADING = '@productivity/FETCH_VELOCITY_LOADING'
export const FETCH_RANKING_LOADING = '@productivity/FETCH_RANKING_LOADING'

export const SET_OVERVIEW = '@productivity/SET_OVERVIEW'
export const SET_VELOCITY = '@productivity/SET_VELOCITY'
export const SET_RANKING = '@productivity/SET_RANKING'

export const FETCH_OVERVIEW_FAILED = '@productivity/FETCH_OVERVIEW_FAILED'
export const FETCH_VELOCITY_FAILED = '@productivity/FETCH_VELOCITY_FAILED'
export const FETCH_RANKING_FAILED = '@productivity/FETCH_RANKING_FAILED'

const initialState = {
  overview: {
    status: LOADING
  },
  velocity: {
    status: LOADING,
    interval: 'custom'
  },
  ranking: {
    status: LOADING
  }
}

export default function ProductivityReducer (state = initialState, action) {
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
    case FETCH_OVERVIEW_FAILED: {
      return {
        ...state,
        overview: {
          data: [],
          status: FAILED
        }
      }
    }
    case FETCH_OVERVIEW_LOADING: {
      return {
        ...state,
        overview: {
          data: [],
          status: LOADING
        }
      }
    }
    case SET_VELOCITY: {
      return {
        ...state,
        velocity: {
          data: action.payload.data,
          interval: action.payload.interval,
          status: SUCCEED
        }
      }
    }
    case FETCH_VELOCITY_FAILED: {
      return {
        ...state,
        velocity: {
          data: [],
          status: FAILED
        }
      }
    }
    case FETCH_VELOCITY_LOADING: {
      return {
        ...state,
        velocity: {
          data: [],
          status: LOADING
        }
      }
    }
    case SET_RANKING: {
      return {
        ...state,
        ranking: {
          data: [...action.payload.data],
          contributors: action.payload.contributors,
          status: SUCCEED
        }
      }
    }
    case FETCH_RANKING_FAILED: {
      return {
        ...state,
        ranking: {
          data: [],
          contributors: 0,
          status: FAILED
        }
      }
    }
    case FETCH_RANKING_LOADING: {
      return {
        ...state,
        ranking: {
          data: [],
          status: LOADING
        }
      }
    }
    default: {
      return state
    }
  }
}
