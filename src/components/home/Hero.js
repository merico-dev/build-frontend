import React, { useState } from 'react'
import styled from '@emotion/styled'

import Logo from '@/images/hero.png'
import MericoBuild from '@/images/merico$ build.png'

import LoginButton from '@/components/LoginButton'
import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'
import { mdMedia, smMedia } from '@/styles/snippets/responsive'
import { css } from '@emotion/core'

const StyledHeroWrapper = styled.div`
  background: url(${Logo}) center bottom no-repeat;
  background-image: url(${Logo}), linear-gradient(45deg,#646777,#9d9faa);
  padding: 22px;
  height: auto;

  ${mdMedia(css`
    height: 362px;
    padding: 61px 20px;
  `)}
`

const StyledHero = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;

  ${mdMedia(css`
    flex-direction: row;
    align-items: center;
  `)}
`

const StyledHeroLogin = styled.div`
  background-color: #fff;
  padding: 30px;
  display: flex;
  justify-content: center;
  border-radius: var(--radius-lg);
  box-shadow: var(--elevation-1);
  flex-direction: column;
  margin: 20px auto 10px;
  ${smMedia(`
    margin: 20px auto auto;
  `)}

`

const StyledHeroLoginTitle = styled.div`
  font-size: 1.5rem;
  color: var(--color-gray-500);
  font-weight: var(--text-semibold);
`

const StyledLoginButton = styled(LoginButton)`
  margin-top: 30px;
`

const StyledHeroText = styled.div`
  font-size: var(--text-md);
  color: #fff;
  text-shadow: var(--elevation-1);
  font-weight: var(--text-semibold);
  ${mdMedia(css`
    font-size: var(--text-xxxl);
  `)}
`

const StyledHeroLogo = styled.img`
  display: block;
  width: 100%;
  max-width: 500px;
  margin-bottom: 10px;

  ${mdMedia(css`
    margin-bottom: 45px;
    width: auto;
    max-width: 100%;
  `)}
`

export default function Hero () {
  const [githubLoading, setGithubLoading] = useState(false)
  const [gitlabLoading, setGitlabLoading] = useState(false)

  return (
    <StyledHeroWrapper>
      <StyledHero>
        <StyledHeroText>
          <StyledHeroLogo src={MericoBuild} alt='merico$ build' />
          data for developer happiness
        </StyledHeroText>
        <StyledHeroLogin>
          <StyledHeroLoginTitle>Analyze Your Code Now!</StyledHeroLoginTitle>
          <StyledLoginButton
            service={{ title: 'GitHub', link: 'github' }}
            ServiceIcon={Github}
            setLoading={setGithubLoading}
            disabled={githubLoading || gitlabLoading}
            isLoading={githubLoading}
            type='signup'
          />
          <StyledLoginButton
            service={{ title: 'GitLab', link: 'gitlab' }}
            ServiceIcon={Gitlab}
            setLoading={setGitlabLoading}
            disabled={githubLoading || gitlabLoading}
            isLoading={gitlabLoading}
            type='signup'
          />
        </StyledHeroLogin>
      </StyledHero>
    </StyledHeroWrapper>
  )
}
