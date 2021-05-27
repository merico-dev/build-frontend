import React, { useState } from 'react'
import styled from '@emotion/styled'
import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'
import LoginButton from '@/components/LoginButton'
import Panel from '@/layouts/Panel'
import { Helmet } from 'react-helmet'

const StyledLogin = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  background-color: var(--color-background);
  align-items: flex-start;
`

const StyledLoginButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 100px;
  padding: 60px 40px;
  background: #fff;
  border-radius: var(--radius-xs);
  border: 1px solid var(--color-gray-300);

  div:first-of-type > a {
    margin-bottom: 25px;
  }
`

export default function Login (props) {
  const {
    location
  } = props
  const [githubLoading, setGithubLoading] = useState(false)
  const [gitlabLoading, setGitlabLoading] = useState(false)

  if (
    location?.state?.from?.pathname &&
    location?.state?.from?.pathname !== '/account/signed-out'
  ) {
    window.localStorage.setItem('redirect', location?.state?.from?.pathname)
  }

  return (
    <Panel sidebar={false}>
      <Helmet>
        <title>Login - Merico Build</title>
      </Helmet>
      <StyledLogin>
        <StyledLoginButtons>
          <LoginButton
            service={{ title: 'GitHub', link: 'github' }}
            ServiceIcon={Github}
            setLoading={setGithubLoading}
            disabled={githubLoading || gitlabLoading}
            isLoading={githubLoading}
          />
          <LoginButton
            service={{ title: 'GitLab', link: 'gitlab' }}
            ServiceIcon={Gitlab}
            setLoading={setGitlabLoading}
            disabled={githubLoading || gitlabLoading}
            isLoading={gitlabLoading}
          />
        </StyledLoginButtons>
      </StyledLogin>
    </Panel>
  )
}
