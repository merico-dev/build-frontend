import {
  SUCCEED,
  LOADING
} from '@/store/statusTypes'

export const FETCH_TOP_ACHIEVEMENTS = '@dashboard/FETCH_TOP_ACHIEVEMENTS'
export const SET_TOP_ACHIEVEMENTS = '@dashboard/SET_TOP_ACHIEVEMENTS'
export const SET_TOP_ACHIEVEMENTS_STATUS = '@dashboard/SET_TOP_ACHIEVEMENTS_STATUS'

export const FETCH_TOP_CONTRIBUTIONS = '@dashboard/FETCH_TOP_CONTRIBUTIONS'
export const SET_TOP_CONTRIBUTIONS = '@dashboard/SET_TOP_CONTRIBUTIONS'
export const SET_TOP_CONTRIBUTIONS_STATUS = '@dashboard/SET_TOP_CONTRIBUTIONS_STATUS'

export const FETCH_DEV_VALUE_BY_TEAM = '@dashboard/FETCH_DEV_VALUE_BY_TEAM'
export const SET_DEV_VALUE_BY_TEAM = '@dashboard/SET_DEV_VALUE_BY_TEAM'
export const SET_DEV_VALUE_BY_TEAM_STATUS = '@dashboard/SET_DEV_VALUE_BY_TEAM_STATUS'

export const FETCH_DEV_VALUE_BY_TEAM_RANKING = '@dashboard/FETCH_DEV_VALUE_BY_TEAM_RANKING'
export const SET_DEV_VALUE_BY_TEAM_RANKING = '@dashboard/SET_DEV_VALUE_BY_TEAM_RANKING'
export const SET_DEV_VALUE_BY_TEAM_RANKING_STATUS = '@dashboard/SET_DEV_VALUE_BY_TEAM_RANKING_STATUS'

export const FETCH_DEV_VALUE_BY_TEAM_RANKING_PROGRESS = '@dashboard/FETCH_DEV_VALUE_BY_TEAM_RANKING_PROGRESS'
export const SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS = '@dashboard/SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS'
export const SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS_STATUS = '@dashboard/SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS_STATUS'

export const FETCH_PRODUCTIVITY_OVERVIEW = '@dashboard/FETCH_PRODUCTIVITY_OVERVIEW'
export const SET_PRODUCTIVITY_OVERVIEW = '@dashboard/SET_PRODUCTIVITY_OVERVIEW'
export const SET_PRODUCTIVITY_OVERVIEW_STATUS = '@dashboard/SET_PRODUCTIVITY_OVERVIEW_STATUS'

export const FETCH_IMPACT_OVERVIEW = '@dashboard/FETCH_IMPACT_OVERVIEW'
export const SET_IMPACT_OVERVIEW = '@dashboard/SET_IMPACT_OVERVIEW'
export const SET_IMPACT_OVERVIEW_STATUS = '@dashboard/SET_IMPACT_OVERVIEW_STATUS'

export const FETCH_QUALITY_OVERVIEW = '@dashboard/FETCH_QUALITY_OVERVIEW'
export const SET_QUALITY_OVERVIEW = '@dashboard/SET_QUALITY_OVERVIEW'
export const SET_QUALITY_OVERVIEW_STATUS = '@dashboard/SET_QUALITY_OVERVIEW_STATUS'

export const SET_SAVE_REPOSITORIES_STATUS = '@dashboard/SET_SAVE_REPOSITORIES_STATUS'
export const SAVE_REPOSITORIES = '@dashboard/SAVE_REPOSITORIES'

const initialState = {
  topAchievements: {
    status: LOADING
  },
  topContributions: {
    status: LOADING,
  },
  devValueByTeam: {
    status: LOADING,
  },
  devValueByTeamRanking: {
    status: LOADING,
  },
  devValueByTeamRankingProgress: {
    status: LOADING,
  },
  productivityOverview: {
    status: LOADING,
  },
  impactOverview: {
    status: LOADING,
  },
  qualityOverview: {
    status: LOADING,
  },
  saveDashboardRepositories: {
    status: SUCCEED
  }
}

export default function DashboardReducer (state = initialState, action) {
  switch (action.type) {
    case SET_TOP_ACHIEVEMENTS: {
      return {
        ...state,
        topAchievements: {
          data: action.payload.data,
          status: SUCCEED
        }
      }
    }
    case SET_TOP_ACHIEVEMENTS_STATUS: {
      return {
        ...state,
        topAchievements: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_TOP_CONTRIBUTIONS: {
      return {
        ...state,
        topContributions: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case SET_TOP_CONTRIBUTIONS_STATUS: {
      return {
        ...state,
        topContributions: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_DEV_VALUE_BY_TEAM: {
      return {
        ...state,
        devValueByTeam: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case SET_DEV_VALUE_BY_TEAM_STATUS: {
      return {
        ...state,
        devValueByTeam: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_DEV_VALUE_BY_TEAM_RANKING: {
      return {
        ...state,
        devValueByTeamRanking: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case SET_DEV_VALUE_BY_TEAM_RANKING_STATUS: {
      return {
        ...state,
        devValueByTeamRanking: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS: {
      return {
        ...state,
        devValueByTeamRankingProgress: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case SET_DEV_VALUE_BY_TEAM_RANKING_PROGRESS_STATUS: {
      return {
        ...state,
        devValueByTeamRankingProgress: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_PRODUCTIVITY_OVERVIEW_STATUS: {
      return {
        ...state,
        productivityOverview: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_PRODUCTIVITY_OVERVIEW: {
      return {
        ...state,
        productivityOverview: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case SET_IMPACT_OVERVIEW_STATUS: {
      return {
        ...state,
        impactOverview: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_IMPACT_OVERVIEW: {
      return {
        ...state,
        impactOverview: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    case SET_QUALITY_OVERVIEW_STATUS: {
      return {
        ...state,
        qualityOverview: {
          data: [],
          status: action.payload
        }
      }
    }
    case SET_QUALITY_OVERVIEW: {
      return {
        ...state,
        qualityOverview: {
          data: action.payload,
          status: SUCCEED
        }
      }
    }
    default: {
      return state
    }
  }
}
