/* eslint-disable max-len */
import React from 'react'
import styled from '@emotion/styled'
import { SUCCEED } from '@/store/statusTypes'
import { mdMedia, lgMedia } from '@/styles/snippets/responsive'
import { ReactComponent as MericoLogo } from '@/images/logo.svg'
import { dashboardLink } from '@/utils/dashboardLink'

const StyledTopbar = styled.div`
  
  padding-top: 36px;

  ${lgMedia(`
    padding-top: 0;
  `)}  
  .topbar .container .home-logged-in-links {
    width: 200px;
  }

  .topbar .navigation {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-content: center;
    padding-top: 36px;

    > a {
      margin-bottom: 10px;
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 24px;
    }

    @media screen and (max-width: 980px) {
      justify-content: center;
    }

    @media screen and (max-width: 960px) {
      > a {
        margin: 8px 0 !important;
      }
    }

    ${mdMedia(`
      
      flex-direction: row;
      padding-top: 0;
      > a {
        margin-bottom: 0;
      }
    `)}

    ${lgMedia(`
      > a {
        font-size: 20px;
      }
    `)}   
  }

  a {
    color: var(--color-gray-500);
    font-weight: normal;
    align-self: center;

    &:hover {
      color: var(--color-gray-400);
    }

  }

  .topbar .logo {
    width: 60px;
    height: 38px;
    background-image: url("data:image/png;base64,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");
    background-size: contain;
    background-position: center;
    margin: 0 auto; 
  }
`

const StyledLoginButton = styled.a`
  border: 1px solid var(--color-brand-400) !important;
  white-space: nowrap;
  margin-top: 36px;
  padding: 4px 22px !important;
  font-size: 24px !important;
  box-shadow: 0px 1.2px 2.4px rgba(0, 0, 0, 0.104), 0px 0.8px 4px rgba(0, 0, 0, 0.072);

  &:hover {
    background-color: var(--color-brand-400) !important;
    color: #ffffff !important;
  }

  ${mdMedia(`
    margin-top: 0;
    font-size: 16px !important;
    padding: 8px 22px !important;
  `)}

  ${lgMedia(`
    font-size: 20px !important;
    
  `)}   
`

const TopBarLogo = styled(MericoLogo)`
  transform: scale(1.5);
  ${mdMedia(`
    transform: scale(1.0);
  `)}
`

export default function Header (props) {
  const { user } = props

  return (
    <StyledTopbar>
      <div className='topbar my-4 my-lg-5'>
        <div className='container'>
          <div className='row align-items-center text-center text-md-left justify-content-center justify-content-md-between'>
            <div className='col-sm-6 col-md-2 col-lg-3 order-2 order-md-1 mb-4 mb-sm-0'>
              <TopBarLogo width='60' height='38' />
            </div>
            <div className='col-10 col-sm-12 col-md-8 d-flex align-items-center justify-content-end order-3 font-16'>
              {user.status === SUCCEED
                ? (
                  <div className='navigation home-logged-in-links'>
                    <a href={dashboardLink()} className='btn btn-light shadow mr-3 flex-fill'>Dashboard</a>
                    <a href='/account/signed-out' className='btn btn-primary shadow  flex-fill'>Logout</a>
                  </div>
                  )
                : (
                  <div className='navigation'>
                    <a href='/team' className='mr-4'>About</a>
                    <a href='/contact' className='mr-4'>Contact</a>
                    <a href='/help' className='mr-4'>Documentation</a>
                    <a href='https://meri.co/' target='_blank' rel='noreferrer' className='mr-4'>Enterprise</a>
                    <a href='https://github.com/merico-dev' target='_blank' rel='noreferrer' className='mr-4'>GitHub</a>
                    <StyledLoginButton href='/login' className='btn btn-light'>Log in</StyledLoginButton>
                  </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </StyledTopbar>
  )
}
