import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_DASHBOARD_OVERVIEW = '@user/FETCH_DASHBOARD_OVERVIEW'
export const SET_DASHBOARD_OVERVIEW = '@user/SET_DASHBOARD_OVERVIEW'
export const FETCH_DASHBOARD_OVERVIEW_STATUS = '@user/FETCH_DASHBOARD_OVERVIEW_STATUS'

const initialState = {
  overview: {
    status: LOADING,
    data: {}
  }
}

export default function DashboardOverviewReducer (state = initialState, action) {
  switch (action.type) {
    case SET_DASHBOARD_OVERVIEW: {
      return {
        ...state,
        overview: {
          ...state.overview,
          status: SUCCEED,
          data: action.payload
        }
      }
    }
    case FETCH_DASHBOARD_OVERVIEW_STATUS: {
      return {
        ...state,
        overview: {
          ...state.overview,
          status: action.payload
        }
      }
    }
    default: {
      return state
    }
  }
}
