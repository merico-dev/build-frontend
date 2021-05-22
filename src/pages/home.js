import React, { Suspense } from 'react'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'
import Topbar from '@/components/Topbar'
import Hero from '@/components/home/Hero'
import Advantages from '@/components/home/Advantages'
import Characteristics from '@/components/home/Characteristics'
import UseCases from '@/components/home/UseCases'
import WhyUs from '@/components/home/WhyUs'
import Differentials from '@/components/home/Differentials'
import PageLoading from '@/components/PageLoading'
import Footer from '@/components/Footer'
import CookieWarning from '@/components/CookieWarning'

const StyledHome = styled.div`
  width: 100%;
  padding-top: 60px;
`
export default function Home () {
  return (
    <StyledHome>
      <Helmet>
        <title>Merico Build - Beta</title>
      </Helmet>
      <Suspense fallback={<PageLoading />}>
        <Topbar fixed showLogo isPublic />
        <Hero />
        <Advantages />
        <Characteristics />
        <UseCases />
        <WhyUs />
        <Differentials />
        <Footer isOpenPage />
        <CookieWarning />
      </Suspense>
    </StyledHome>
  )
}
