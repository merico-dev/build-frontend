/* eslint-disable max-len */
import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { useHistory } from 'react-router-dom'
import { MP, SignUpEvents } from '@/utils/mixpanel'

import { ReactComponent as GithubIcon } from '@/icons/github.svg'
import { ReactComponent as GitlabIcon } from '@/icons/gitlab.svg'

// const GithubIcon = 'https://cdn.mericobuild.com/home/images/github.svg'
// const GitlabIcon = 'https://cdn.mericobuild.com/home/images/gitlab.svg'
const HeroBackground = 'https://cdn.mericobuild.com/home/images/hero-bg.png'

const bpMax1278 = (content) => {
  return css`
    @media screen and (max-width: 1278.98px) {
      ${content}
    }
  `
}

const bpMax979 = (content) => {
  return css`
    @media screen and (max-width: 979.98px) {
      ${content}
    }
  `
}

const bpMin980 = (content) => {
  return css`
    @media screen and (min-width: 980px) {
      ${content}
    }
  `
}

const StyledHero = styled.div`

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .hero-headline {
    color: var(--color-gray-500);

    > .last-word {
      color: var(--color-brand-500);
    }
  }

  .container {
    position: relative;
    z-index: 1;
  }

  :before,
  :after {
    content: "";
    display: block;
    height: 80%;
    width: 30%;
    position: absolute;
    top: 50%;
    background-size: contain;
    background-repeat: no-repeat;
    transform: translateY(-50%);
    z-index: 0;
  }

  :before {
    background-image: url(${HeroBackground});
    background-position: center left;
    left: 0;
  }

  :after {
    background-image: url(${HeroBackground});
    transform: scaleX(-1) translateY(-50%);
    right: 0;
    background-position: center left;
  }

  .service-icon {
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 10px;
  }

  ${bpMax1278(css`
    :before,
    :after {
      opacity: 0.4;
    }
  `)}

  ${bpMin980(`
    min-height: 70vh;
  `)}

  ${bpMax979(`
    :before,
    :after {
      top: 100%;
    }
    min-height: 50vh;
  `)}
`

export default function Hero (props) {
  // const { heroTextRef } = props
  const history = useHistory()

  const SignupGithub = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const signupRoute = e.target.getAttribute('href')
    MP.track(SignUpEvents.GITHUB, {}, {
      send_immediately: true,
    })
    history.push(signupRoute)
  }

  const SignupGitlab = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const signupRoute = e.target.getAttribute('href')
    MP.track(SignUpEvents.GITLAB, {}, {
      send_immediately: true,
    })
    history.push(signupRoute)
  }

  return (
    <StyledHero className='hero'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-lg-8'>
            <h1 className='text-center mb-5 hero-headline'>
              Metrics for Effective OSS <span className='last-word'>Communities</span>&nbsp;
              {/* (ANIMATION DISABLED)
                <span
                className='txt-rotate text-primary'
                data-period='5000'
                data-rotate='[ "Developers", "Contributors", "Creators"]'
                ref={heroTextRef}
              /> */}
            </h1>
            <div className='row row-cols-1 row-cols-sm-2 justify-content-center px-3 px-md-5 mx-md-5 pt-lg-3'>
              <div className='col mb-3'>
                <a href='/onboarding/github' onClick={(e) => SignupGithub(e)} className='btn btn-primary btn-block font-16 shadow' style={{ fontSize: '16px' }}><span className='service-icon'><GithubIcon fill='#ffffff' width='24' height='24' alt='' /></span> Start with GitHub</a>
              </div>
              <div className='col'>
                <a href='/onboarding/gitlab' onClick={(e) => SignupGitlab(e)} className='btn btn-primary btn-block font-16 shadow' style={{ fontSize: '16px' }}><span className='service-icon'><GitlabIcon width='24' height='24' alt='' /></span> Start with GitLab</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledHero>
  )
}
