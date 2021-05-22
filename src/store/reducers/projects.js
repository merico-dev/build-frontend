import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_PROJECTS = '@projects/FETCH_PROJECTS'
export const SET_PROJECTS = '@projects/SET_PROJECTS'
export const SET_PROJECTS_STATUS = '@quality/SET_PROJECTS_STATUS'

const initialState = {
  status: LOADING,
  data: []
}

export default function ProjectsReducer (state = initialState, action) {
  switch (action.type) {
    case SET_PROJECTS: {
      return {
        ...state,
        data: action.payload,
        status: SUCCEED
      }
    }
    case SET_PROJECTS_STATUS: {
      return {
        ...state,
        data: [],
        status: action.payload
      }
    }
    default: {
      return state
    }
  }
}
