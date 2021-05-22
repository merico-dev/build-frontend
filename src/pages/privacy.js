import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import Scrollspy from 'react-scrollspy'
import { Helmet } from 'react-helmet'

import TermsPanel, { StyledTermsContent } from '@/layouts/TermsPanel'
import TermsSidebar from '@/components/TermsSidebar'
import PageLoading from '@/components/PageLoading'
import useTermsMenu from '@/utils/useTermsMenu'

const PrivacyText = lazy(() => import('@/components/PrivacyText'))

export default function Privacy () {
  const menu = [
    {
      id: 'what-information-do-we-collect-and-for-what-purpose',
      title: 'What information do we collect and for what purpose'
    },
    {
      id: 'how-we-use-cookies-and-other-tracking-technology-to-collect-information',
      title: 'How we use cookies and other tracking technology to collect information'
    },
    { id: 'sharing-of-your-information', title: 'Sharing of your information' },
    { id: 'control-over-your-information', title: 'Control over your information' },
    { id: 'third-party-tracking-and-online-advertising', title: 'Third party tracking and online advertising' },
    { id: 'how-we-store-and-protect-your-information', title: 'How we store and protect your information' },
    { id: 'childrens-privacy', title: 'Children’s privacy' },
    { id: 'links-to-other-websites-and-services', title: 'Links to other websites and services' },
    { id: 'how-to-contact-us', title: 'How to contact us' },
    { id: 'changes-to-our-privacy-policy', title: 'Changes to our privacy policy' }
  ]
  const [
    menuItems,
    reloadMenu
  ] = useTermsMenu(menu.map(({ id }) => id))
  const isAuthenticated = useSelector((state) => state.user.status === 'SUCCEED')

  return (
    <TermsPanel sidebar={false} isAuthenticated={isAuthenticated}>
      <Helmet>
        <title>Privacy Policy - Merico Build</title>
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
              menu.map(({ title, id }) => (
                <a href={`#${id}`} key={id}>{title}</a>
              ))
            }
          </Scrollspy>
        </TermsSidebar>
        <StyledTermsContent>
          <PrivacyText />
        </StyledTermsContent>
      </Suspense>
    </TermsPanel>
  )
}
