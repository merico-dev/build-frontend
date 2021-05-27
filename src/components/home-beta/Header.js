import React from 'react'
import styled from '@emotion/styled'
import { mdMedia } from '@/styles/snippets/responsive'
import TopBar from '@/components/home-beta/TopBar'
import Hero from '@/components/home-beta/Hero'
import ProductHuntBadge from '@/components/home-beta/ProductHuntBadge'

import { ReactComponent as BrandForbes } from '@/images/brands/forbes.svg'
import { ReactComponent as BrandItPro } from '@/images/brands/it-pro.svg'
import { ReactComponent as BrandDevOps } from '@/images/brands/devops.svg'

const StyledHeader = styled.header``

const StyledBrands = styled.div`
  display: flex;
  margin-top: 10vh;
  justify-content: space-evenly;
  flex-direction: column;
  width: 100%;
  min-height: 100px;
  background-color: transparent;
  align-items: center;
  padding: 13px 16vw;
  flex-wrap: wrap;

  > div, > a {
    margin: 0 0 20px 0; 
  }

  ${mdMedia(`
    margin-top: 0;
    background-color: #f4f4f6;
    flex-direction: row;
    > div, > a {
      margin: 0;
    }
  `)}  
`

const StyledBrandLink = styled.a`
  outline: none;
  text-decoration: none;
  border: 0;
`

export default function Header (props) {
  const { heroTextRef, user } = props

  return (
    <>
      <StyledHeader>
        <TopBar user={user} />
        <Hero heroTextRef={heroTextRef} />
      </StyledHeader>
      <StyledBrands>
        <div>
          <div style={{ display: 'flex', width: '80', height: '32', alignItems: 'center' }}>
            <ProductHuntBadge type='topPost' />
          </div>
        </div>
        <StyledBrandLink
          // eslint-disable-next-line max-len
          href='https://www.forbes.com/sites/kevinanderton/2021/02/23/the-problem-with-open-source-game-development-infographic/?sh=24126566ecc3'
          target='_blank'
          rel='noreferrer'
        >
          <BrandForbes width='80' height='32' />
        </StyledBrandLink>
        <StyledBrandLink
          // eslint-disable-next-line max-len
          href='https://www.itpro.com/software/development/358208/merico-debuts-advanced-code-analytics-platform-for-developers'
          target='_blank'
          rel='noreferrer'
        >
          <BrandItPro width='80' height='32' />
        </StyledBrandLink>
        <StyledBrandLink
          // eslint-disable-next-line max-len
          href='https://devops.com/merico-releases-powerful-code-analytics-platform-for-developers-to-capture-articulate-contribution-value/'
          target='_blank'
          rel='noreferrer'
        >
          <BrandDevOps
            width='80'
            height='32'
            style={{ transform: 'scale(1.6)' }}
          />
        </StyledBrandLink>
      </StyledBrands>
    </>
  )
}
