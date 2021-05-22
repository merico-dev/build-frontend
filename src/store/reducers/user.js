import {
  FAILED,
  SUCCEED,
  LOADING,
  LOGGED_OUT
} from '@/store/statusTypes'

export const SET_USER = '@user/SET_USER'
export const FETCH_USER = '@user/FETCH_USER'
export const FETCH_USER_FAILED = '@user/FETCH_USER_FAILED'
export const SET_FETCH_USER_STATUS = '@user/SET_FETCH_USER_STATUS'

export const LOGOUT_USER = '@user/LOGOUT_USER'
export const SET_LOGOUT_USER = '@user/SET_LOGOUT_USER'

export const SYNC_GITLAB = '@user/SYNC_GITLAB'
export const SET_SYNC_GITLAB_STATUS = '@user/SET_SYNC_GITLAB_STATUS'

export const SYNC_GITHUB = '@user/SYNC_GITHUB'
export const SET_SYNC_GITHUB_STATUS = '@user/SET_SYNC_GITHUB_STATUS'

const initialState = {
  status: LOADING,
  syncGitlab: SUCCEED,
  syncGithub: SUCCEED
}

export default function UserReducer (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        status: SUCCEED,
        data: action.payload
      }
    }
    case FETCH_USER_FAILED: {
      return {
        ...state,
        status: FAILED,
        data: []
      }
    }
    case SET_FETCH_USER_STATUS: {
      return {
        ...state,
        status: action.payload
      }
    }
    case SET_SYNC_GITLAB_STATUS: {
      return {
        ...state,
        syncGitlab: action.payload
      }
    }
    case SET_SYNC_GITHUB_STATUS: {
      return {
        ...state,
        syncGithub: action.payload
      }
    }
    case SET_LOGOUT_USER: {
      return {
        status: LOGGED_OUT,
        syncGitlab: FAILED,
        syncGithub: FAILED,
        data: action.payload
      }
    }
    default: {
      return state
    }
  }
}
