import { grades } from '@/enums/badge'
import { JAVASCRIPT, JAVA, PYTHON, CPP, C, GO, TYPESCRIPT, RUBY } from '@/enums/languages'

const defaultSettings = {
  badges: {
    linguist: {
      [JAVASCRIPT]: {
        [grades.gold]: 6186,
        [grades.silver]: 1159,
        [grades.bronze]: 186,
        [grades.iron]: 16
      },
      [JAVA]: {
        [grades.gold]: 11640,
        [grades.silver]: 4176,
        [grades.bronze]: 587,
        [grades.iron]: 47
      },
      [PYTHON]: {
        [grades.gold]: 3679,
        [grades.silver]: 870,
        [grades.bronze]: 136,
        [grades.iron]: 12
      },
      [CPP]: {
        [grades.gold]: 7325,
        [grades.silver]: 1372,
        [grades.bronze]: 159,
        [grades.iron]: 12
      },
      [C]: {
        [grades.gold]: 9470,
        [grades.silver]: 1484,
        [grades.bronze]: 163,
        [grades.iron]: 12
      },
      [GO]: {
        [grades.gold]: 6191,
        [grades.silver]: 1086,
        [grades.bronze]: 197,
        [grades.iron]: 19
      },
      [TYPESCRIPT]: {
        [grades.gold]: 3906,
        [grades.silver]: 952,
        [grades.bronze]: 176,
        [grades.iron]: 15
      },
      [RUBY]: {
        [grades.gold]: 4563,
        [grades.silver]: 1024,
        [grades.bronze]: 153,
        [grades.iron]: 14
      }
    }
  }
}

const developmentLinguistThresholds = {
  [grades.gold]: 90,
  [grades.silver]: 75,
  [grades.bronze]: 50,
  [grades.iron]: 20
}

const developmentSettings = {
  ...defaultSettings,
  badges: {
    linguist: {
      [JAVASCRIPT]: developmentLinguistThresholds,
      [JAVA]: developmentLinguistThresholds,
      [PYTHON]: developmentLinguistThresholds,
      [CPP]: developmentLinguistThresholds,
      [C]: developmentLinguistThresholds,
      [GO]: developmentLinguistThresholds,
      [TYPESCRIPT]: developmentLinguistThresholds,
      [RUBY]: developmentLinguistThresholds
    }
  }
}

const getThresholdByEnv = (envName) => {
  switch (envName) {
    case 'local':
      return developmentSettings
    case 'staging':
      return developmentSettings
    default:
      return defaultSettings
  }
}

export default getThresholdByEnv
