import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_MERGE_REQUESTS = '@projects/FETCH_MERGE_REQUESTS'
export const SET_MERGE_REQUESTS = '@projects/SET_MERGE_REQUESTS'
export const SET_MERGE_REQUESTS_STATUS = '@quality/SET_MERGE_REQUESTS_STATUS'

const initialState = {
  status: LOADING,
  data: [],
  interval: null
}

export default function MergeRequestsReducer (state = initialState, action) {
  switch (action.type) {
    case SET_MERGE_REQUESTS: {
      return {
        ...state,
        data: action.payload.stats,
        interval: action.payload.interval,
        status: SUCCEED
      }
    }
    case SET_MERGE_REQUESTS_STATUS: {
      return {
        ...state,
        data: [],
        interval: null,
        status: action.payload
      }
    }
    default: {
      return state
    }
  }
}
