/* eslint-disable max-len */
import React, { Suspense, lazy } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Scrollspy from 'react-scrollspy'

import TermsPanel, { StyledTermsContent } from '@/layouts/TermsPanel'
import TermsSidebar from '@/components/TermsSidebar'
import PageLoading from '@/components/PageLoading'
import useTermsMenu from '@/utils/useTermsMenu'

const TermsText = lazy(() => import('@/components/TermsText'))

export default function Terms () {
  const menu = [
    { id: 'the-merico-services', title: 'The Merico Services' },
    { id: 'eligibility', variant: 'small', title: 'Eligibility' },
    { id: 'limited-license', variant: 'small', title: 'Limited License' },
    { id: 'merico-accounts', variant: 'small', title: 'Merico Accounts' },
    { id: 'administrative-accounts', variant: 'small', title: 'Administrative Accounts' },
    { id: 'merico-services-rules', variant: 'small', title: 'Merico Services Rules' },
    { id: 'disputes-with-other-users', variant: 'small', title: 'Disputes with other Users' },
    { id: 'third-party-systems-and-services-access-by-merico', variant: 'small', title: 'Third Party Systems and Services Access by Merico' },
    { id: 'third-party-links-and-information-on-the-merico-services', variant: 'small', title: 'Third-Party Links and Information on the Merico Services' },
    { id: 'changes-to-the-merico-services', variant: 'small', title: 'Changes to the Merico Services' },
    { id: 'user-submissions', title: 'User Submissions' },
    { id: 'our-proprietary-rights', title: 'Our Proprietary Rights' },
    { id: 'paid-features-of-the-merico-services', title: 'Paid Features of the Merico Services' },
    { id: 'fees', variant: 'small', title: 'Fees' },
    { id: 'subscription-services', variant: 'small', title: 'Subscription Services' },
    { id: 'no-refunds', variant: 'small', title: 'No Refunds' },
    { id: 'payment-information;-taxes', variant: 'small', title: 'Payment Information; Taxes' },
    { id: 'payments-to-you', variant: 'small', title: 'Payments to You' },
    { id: 'payment-processing-services', variant: 'small', title: 'Payment Processing Services' },
    { id: 'privacy', title: 'Privacy' },
    { id: 'security', title: 'Security' },
    { id: 'dmca-notice', title: 'DMCA Notice' },
    { id: 'indemnity', title: 'Indemnity' },
    { id: 'third-party-advertisers', title: 'Third Party Advertisers' },
    { id: 'no-warranty', title: 'No Warranty' },
    { id: 'limitation-of-liability', title: 'Limitation of Liability' },
    { id: 'governing-law,-arbitration,-and-class-action/jury-trial-waiver', title: 'Governing Law, Arbitration, and Class Action/Jury Trial Waiver' },
    { id: 'governing-law', variant: 'small', title: 'Governing Law' },
    { id: 'arbitration', variant: 'small', title: 'Arbitration' },
    { id: 'class-action/jury-trial-waiver', variant: 'small', title: 'Class Action/Jury Trial Waiver' },
    { id: 'general', title: 'General' },
    { id: 'assignment', variant: 'small', title: 'Assignment' },
    { id: 'notification-procedures-and-changes-to-these-terms', variant: 'small', title: 'Notification Procedures and Changes to these Terms' },
    { id: 'no-waiver', variant: 'small', title: 'No Waiver' },
    { id: 'contact', variant: 'small', title: 'Contact' },
    { id: 'disclosures;-california-residents', variant: 'small', title: 'Disclosures; California Residents' },
    { id: 'entire-agreement/severability', variant: 'small', title: 'Entire Agreement/Severability' }
  ]
  const [
    menuItems,
    reloadMenu
  ] = useTermsMenu(menu.map(({ id }) => id))
  const isAuthenticated = useSelector((state) => state.user.status === 'SUCCEED')

  return (
    <TermsPanel sidebar={false} isAuthenticated={isAuthenticated}>
      <Helmet>
        <title>Terms and Conditions - Merico Build</title>
      </Helmet>
      <Suspense fallback={<PageLoading />}>
        <TermsSidebar className='TermsSidebar' isAuthenticated={isAuthenticated}>
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
        <StyledTermsContent>
          <TermsText />
        </StyledTermsContent>
      </Suspense>
    </TermsPanel>
  )
}
