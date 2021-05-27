import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_BADGES = '@badges/FETCH_BADGES'
export const SET_BADGES = '@badges/SET_BADGES'
export const SET_BADGES_STATUS = '@badges/SET_BADGES_STATUS'

export const FETCH_ASSERTION = '@badges/FETCH_ASSERTION'
export const SET_ASSERTION = '@badges/SET_ASSERTION'
export const SET_ASSERTION_STATUS = '@badges/SET_ASSERTION_STATUS'

const initialState = {
  badges: {
    status: LOADING
  },
  assertion: {
    status: LOADING
  }
}

export default function BadgesReducer (state = initialState, action) {
  switch (action.type) {
    case SET_BADGES: {
      return {
        ...state,
        badges: {
          data: action.payload.data,
          status: SUCCEED
        }
      }
    }
    case SET_BADGES_STATUS: {
      return {
        ...state,
        badges: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_ASSERTION: {
      return {
        ...state,
        assertion: {
          data: action.payload.data,
          status: SUCCEED
        }
      }
    }
    case SET_ASSERTION_STATUS: {
      return {
        ...state,
        assertion: {
          data: null,
          status: action.payload
        }
      }
    }
    default: {
      return state
    }
  }
}
