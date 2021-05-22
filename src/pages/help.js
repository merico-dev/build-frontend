/* eslint-disable max-len */
import React, { Suspense, lazy } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Scrollspy from 'react-scrollspy'

import useTermsMenu from '@/utils/useTermsMenu'
import TermsPanel, { StyledTermsContent } from '@/layouts/TermsPanel'
import TermsSidebar from '@/components/TermsSidebar'
import PageLoading from '@/components/PageLoading'

const HelpText = lazy(() => import('@/components/HelpPageContent'))

export default function Help () {
  const menu = [
    // { title: 'Dev Share', id: 'dev-share' },
    { title: 'Impact', id: 'impact' },
    { title: 'Productivity', id: 'productivity' },
    { title: 'ELOC', variant: 'small', id: 'eloc' },
    { title: 'Quality', id: 'quality' },
    { title: 'Doc Coverage', variant: 'small', id: 'doc-coverage' },
    { title: 'Test Coverage', variant: 'small', id: 'test-coverage' },
    { title: 'Reusability', variant: 'small', id: 'reusability' },
    { title: 'Modularity', variant: 'small', id: 'modularity' },
    // { title: 'Repositories', id: 'repositories' },
    { title: 'Badges', id: 'badges' },
    { title: 'Merges', id: 'merges' }
    // { title: 'Kudos', id: 'kudos' },
  ]

  const [
    menuItems,
    reloadMenu
  ] = useTermsMenu(menu.map(({ id }) => id))
  const isAuthenticated = useSelector((state) => state.user.status === 'SUCCEED')

  return (
    <TermsPanel sidebar={false} isAuthenticated={isAuthenticated}>
      <Helmet>
        <title>Help Center - Merico Build</title>
      </Helmet>
      <Suspense fallback={<PageLoading />}>
        <TermsSidebar
          className='TermsSidebar'
          isAuthenticated={isAuthenticated}
        >
          <Scrollspy
            componentTag='div'
            items={menuItems}
            currentClassName='is-current'
            offset={-5}
            renderCount={reloadMenu}
          >
            {
              menu.map(({ title, id, variant }) => (
                <a href={`#${id}`} className={variant} key={id}>{title}</a>
              ))
            }
          </Scrollspy>
        </TermsSidebar>
        <StyledTermsContent style={{ minHeight: '1110px', marginTop: '70px' }}>
          <HelpText />
        </StyledTermsContent>
      </Suspense>
    </TermsPanel>
  )
}
