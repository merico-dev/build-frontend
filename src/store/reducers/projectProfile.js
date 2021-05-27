import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_PROJECT_PROFILE = '@user/FETCH_PROJECT_PROFILE'
export const SET_PROJECT_PROFILE = '@user/SET_PROJECT_PROFILE'
export const FETCH_PROJECT_PROFILE_STATUS = '@user/FETCH_PROJECT_PROFILE_STATUS'

const initialState = {
  status: LOADING,
  data: {}
}

export default function ProjectProfileReducer (state = initialState, action) {
  switch (action.type) {
    case SET_PROJECT_PROFILE: {
      return {
        ...state,
        status: SUCCEED,
        data: action.payload
      }
    }
    case FETCH_PROJECT_PROFILE_STATUS: {
      return {
        ...state,
        status: action.payload
      }
    }
    default: {
      return state
    }
  }
}
