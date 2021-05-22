import { useContext } from 'react'
import { setupI18n } from '@lingui/core'

import AppContext from '@/utils/AppContext'
import en from '@/locales/en/messages.po'
import zh from '@/locales/zh/messages.po'

/**
 * Returns i18n instance from AppContext
 * @returns i18n instance
 */
export const useI18n = () => {
  const { i18n } = useContext(AppContext)

  return i18n
}

/**
 * Creates and return a new i18n instance
 * @returns i18n instance
 */
export const i18nInstance = () => {
  return setupI18n({
    language: 'en',
    catalogs: {
      en, zh
    },
  })
}
