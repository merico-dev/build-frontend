/* eslint-disable max-len */
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Suspense } from 'react'
import {
  Container
} from '@material-ui/core'
import { Helmet } from 'react-helmet'

import Panel from '@/layouts/Panel'
import PageLoading from '@/components/PageLoading'
import PageErrorMessage from '@/components/PageErrorMessage'

export default function Error (props) {
  const {
    title = '404',
    text = 'Page not found'
  } = props

  return (
    <Panel sidebar={false}>
      <Helmet>
        <title>{title} - Merico Build</title>
      </Helmet>
      <Suspense fallback={<PageLoading />}>
        <Container css={css`
          padding: 70px 0 40px;
          text-align: center;
        `}
        >
          <PageErrorMessage title={title} text={text} />
        </Container>
      </Suspense>
    </Panel>
  )
}
