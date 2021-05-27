import {
  FAILED,
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_GITHUB_REPOS = '@repositories/FETCH_GITHUB_REPOS'
export const FETCH_GITHUB_REPOS_LOADING = '@repositories/FETCH_GITHUB_REPOS_LOADING'
export const FETCH_GITHUB_REPOS_FAILED = '@repositories/FETCH_GITHUB_REPOS_FAILED'
export const SET_GITHUB_REPOS = '@repositories/SET_GITHUB_REPOS'

export const FETCH_GITLAB_REPOS = '@repositories/FETCH_GITLAB_REPOS'
export const FETCH_GITLAB_REPOS_FAILED = '@repositories/FETCH_GITLAB_REPOS_FAILED'
export const SET_GITLAB_REPOS = '@repositories/SET_GITLAB_REPOS'

export const DELETE_REPOSITORIES = '@repositories/DELETE_REPOSITORIES'
export const SET_DELETE_REPOSITORIES_STATUS = '@repositories/SET_DELETE_REPOSITORIES_STATUS'

export const ANALYZE_REPO = '@repositories/ANALYZE_REPO'
export const ANALYZE_REPO_SET = '@repositories/ANALYZE_REPO_SET'
export const ANALYZE_REPO_FAILED = '@repositories/ANALYZE_REPO_FAILED'

export const ADD_REPOSITORIES = '@repositories/ADD_REPOSITORIES'
export const SET_ADD_REPOSITORIES_RESPONSE = '@repositories/SET_ADD_REPOSITORIES_RESPONSE'

export const FETCH_LIST = '@repositories/FETCH_LIST'
export const FETCH_LIST_FAILED = '@repositories/FETCH_LIST_FAILED'
export const SET_LIST = '@repositories/SET_LIST'
export const SET_LIST_DATA = '@repositories/SET_LIST_DATA'

export const FETCH_REPO_PAGE_LIST = '@repositories/FETCH_REPO_PAGE_LIST'
export const FETCH_REPO_PAGE_LIST_STATUS = '@repositories/FETCH_REPO_PAGE_LIST_STATUS'
export const SET_REPO_PAGE_LIST = '@repositories/SET_REPO_PAGE_LIST'

export const DELETE_REPOSITORY = '@repositories/DELETE_REPOSITORY'

const initialState = {
  list: {
    status: LOADING,
    data: []
  },
  githubRepos: {
    status: LOADING
  },
  gitlabRepos: {
    status: LOADING
  },
  repoPageList: {
    status: LOADING
  },
  deleteRepositoriesStatus: LOADING,
  addRepositoriesReponse: null
}

export default function RepositoriesReducer (state = initialState, action) {
  switch (action.type) {
    case SET_LIST: {
      return {
        ...state,
        list: {
          data: action.payload.data,
          totalRecords: action.payload.totalRecords,
          status: SUCCEED
        }
      }
    }
    case SET_LIST_DATA: {
      return {
        ...state,
        list: {
          ...state.list,
          data: action.payload.data
        }
      }
    }
    case SET_GITHUB_REPOS: {
      return {
        ...state,
        githubRepos: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case FETCH_GITHUB_REPOS_LOADING: {
      return {
        ...state,
        githubRepos: {
          data: [],
          status: LOADING
        }
      }
    }
    case FETCH_GITHUB_REPOS_FAILED: {
      return {
        ...state,
        githubRepos: {
          data: [],
          status: FAILED
        }
      }
    }
    case SET_GITLAB_REPOS: {
      return {
        ...state,
        gitlabRepos: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case FETCH_GITLAB_REPOS_FAILED: {
      return {
        ...state,
        gitlabRepos: {
          data: [],
          status: FAILED
        }
      }
    }
    case FETCH_LIST_FAILED: {
      return {
        ...state,
        list: {
          data: [],
          totalRecords: 0,
          status: FAILED
        }
      }
    }
    case SET_ADD_REPOSITORIES_RESPONSE: {
      return {
        ...state,
        addRepositoriesReponse: action.payload
      }
    }
    case SET_DELETE_REPOSITORIES_STATUS: {
      return {
        ...state,
        deleteRepositoriesStatus: action.payload
      }
    }
    case DELETE_REPOSITORY: {
      return {
        ...state,
        list: {
          ...state.list,
          data: state.list.data.filter(({ gitUrl }) => gitUrl !== action?.payload?.gitUrl),
          totalRecords: state.list.totalRecords - 1
        },
        repoPageList: {
          ...state.repoPageList,
          data: state.repoPageList.data.filter(({ gitUrl }) => gitUrl !== action?.payload?.gitUrl),
          totalRecords: state.repoPageList.totalRecords - 1
        }
      }
    }
    case FETCH_REPO_PAGE_LIST_STATUS: {
      return {
        ...state,
        repoPageList: {
          ...state.repoPageList,
          status: action.payload
        }
      }
    }
    case SET_REPO_PAGE_LIST: {
      return {
        ...state,
        repoPageList: {
          ...state.repoPageList,
          data: action.payload.data,
          totalRecords: action.payload.totalRecords,
          status: SUCCEED
        }
      }
    }
    default: {
      return state
    }
  }
}
