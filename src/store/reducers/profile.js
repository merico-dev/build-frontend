import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_PROFILE = '@user/FETCH_PROFILE'
export const SET_PROFILE = '@user/SET_PROFILE'
export const FETCH_PROFILE_STATUS = '@user/FETCH_PROFILE_STATUS'

const initialState = {
  profile: {
    status: LOADING,
    data: []
  }
}

export default function UserReducer (state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE: {
      return {
        ...state,
        profile: {
          ...state.profile,
          status: SUCCEED,
          data: action.payload
        }
      }
    }
    case FETCH_PROFILE_STATUS: {
      return {
        ...state,
        profile: {
          ...state.profile,
          status: action.payload
        }
      }
    }
    default: {
      return state
    }
  }
}
