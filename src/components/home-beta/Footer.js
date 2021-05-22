/* eslint-disable max-len */
import React from 'react'
import styled from '@emotion/styled'
import { SUCCEED } from '@/store/statusTypes'

// const footerImage = 'https://cdn.mericobuild.com/home/images/footer.png'

const StyledFooter = styled.footer`
  background: #E65728;
  color: #fff;
  padding: 6rem 0 0;
  display: block;

  .footer-1:after {
    content: "";
    display: block;
    height: 9px;
    width: 100%;
    background: #fff;
    position: relative;
    top: -10px;
  }

  a {
    color: #fff;
  }

  a:hover {
    color: #fff;
    opacity: 0.7;
    text-decoration: none;
  }
`

export default function Footer (props) {
  const { user } = props

  return (
    <StyledFooter>
      <div className='container'>
        <div className='footer-1'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-xl-11'>
              <div className='row justify-content-center justify-content-sm-between'>
                <div className='col-sm-12'>
                  <h4 className='font-38 font-weight-bolder mb-4'>OSS Community Metrics for Maintainers and Contributors</h4>
                </div>
                <div className='col-8 col-sm-5 col-md-4 mt-4 mt-md-0'>
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='border-bottom'>
          <div className='row justify-content-center py-5 my-5'>
            <div className='col-sm-12 col-md-6 mb-2'>
              <div className='d-flex flex-column justify-content-center justify-content-md-between text-uppercase font-16 text-center text-md-left'>
                &nbsp;
              </div>
            </div>
            <div className='col-sm-12 col-md-2 mb-2'>
              <div className='display-4 text-white font-weight-bold mb-4 text-center text-md-left'>COMPANY</div>
              <div className='d-flex flex-column justify-content-center justify-content-md-between text-uppercase font-16 text-center text-md-left'>
                <a href='/team' className='mb-3 mb-md-0'>About</a>
                <a href='https://meri.co/' target='_blank' rel='noreferrer' className='mb-3 mb-md-0'>Enterprise</a>
                <a href='/privacy' className='mb-3 mb-md-0'>Privacy</a>
                <a href='/terms' className='mb-3 mb-md-0'>Terms</a>
              </div>
            </div>
            <div className='col-sm-12 col-md-2 mb-2'>
              <div className='display-4 text-white font-weight-bold mb-4 text-center text-md-left'>RESOURCES</div>
              <div className='d-flex flex-column justify-content-center justify-content-md-between text-uppercase font-16 text-center text-md-left'>
                <a href='/help' className='mb-3 mb-md-0'>Documentation</a>
                <a href='https://github.com/merico-dev' target='_blank' rel='noreferrer' className='mb-3 mb-md-0'>GitHub</a>
              </div>
            </div>
            <div className='col-sm-12 col-md-2 mb-2'>
              <div className='display-4 text-white font-weight-bold mb-4 text-center text-md-left'>&nbsp;</div>
              <div className='d-flex flex-column justify-content-center justify-content-md-between text-uppercase font-16 text-center text-md-left'>
                {user.status === SUCCEED ? (<a href='/account/signed-out' className='mb-3 mb-md-0'>Logout</a>) : (<a href='/login' className='mb-3 mb-md-0'>Login</a>)}
                <a href='/contact' className='mb-3 mb-md-0'>Contact</a>
                <a href='/onboarding/github' className='mb-3 mb-md-0'>Signup</a>
              </div>
            </div>
          </div>
        </div>

        <div className='row justify-content-center pt-1 pb-5'>
          <div className='col-12'>
            <div className='text-center text-sm-right py-4'>
              &copy; 2021 Merico Inc. Licensed under <a href='https://opensource.org/licenses/MIT' target='_blank' rel='noreferrer' style={{ textDecoration: 'underline' }}>The MIT License</a>
            </div>
          </div>
        </div>
      </div>
    </StyledFooter>
  )
}
