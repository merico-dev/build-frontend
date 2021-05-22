import React, { useEffect, useMemo, useState } from 'react'
import { Typography, useMediaQuery, useTheme } from '@material-ui/core'
import styled from '@emotion/styled'

import OnboardingButtons from '@/components/OnboardingButtons'
import BrowseRepositoriesList from '@/components/BrowseRepositoriesList'

import AddRepositoryByUrl from '@/components/AddRepository/AddRepositoryByUrl'
import { StyledOnboardingText } from '@/components/OnboardingText'
import HelpPopover from '@/components/HelpPopover'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle-color.svg'
import { postData } from '@/utils/fetchData'
import { smMedia } from '@/styles/snippets/responsive'

import { MP, OnboardingEvents } from '@/utils/mixpanel'
import { useHistory } from 'react-router-dom'
import { MAX_REPOSITORIES_PER_SELECTION } from '@/enums/repositories'
import { getServiceProvider, getDemoRepository } from '@/utils/user/user'

const StyledSelectRepoContent = styled.div`
  width: 100%;
  /* max-width: 660px; */
  margin: 20px auto 0;
  ${smMedia(`
    margin: 48px auto 70px;
  `)}
`

const StyledSelectRepoTitle = styled.div`
  font-size: var(--text-md);
  color: var(--color-gray-500);
  font-weight: var(--text-semibold);

  ${smMedia(`
    font-size: var(--text-xl);
  `)}
`

const StyledHelpPopover = styled(HelpPopover)`
  margin-left: 5px;
  color: var(--color-gray-400);
`

const StyledSelectRepoBrowse = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  flex-wrap: wrap;
  gap: 10px;
  ${smMedia(`
    margin-top: 17px;
  `)}
`

export default function SelectRepo (props) {
  const {
    user: {
      data: userData
    }
  } = props

  const gitService = getServiceProvider(userData)
  const [repositoryList, setRepositoryList] = useState([])
  const [repositoryExternalList, setRepositoryExternalList] = useState([])
  const [disabled, setDisabled] = useState(true)
  const [skipping, setSkipping] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const history = useHistory()

  const handleAddRepositories = (list) => {
    setRepositoryList(list)
  }
  const onConfirm = async () => {
    setErrorMessage(false)
    if (repositoryList.length < 1 && repositoryExternalList.length < 1) { return }

    // Disable actions
    setDisabled(true)
    setSkipping(true)

    try {
      await postData('user/setIsOnboarded', { isOnboarded: true })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to set is onboarded')
    }

    try {
      const response = await postData('projects', { projects: repositoryList.concat(repositoryExternalList) })
      // TODO: correct handle projects async
      history.push('/onboarding/secondary-emails/', response)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message)
      setDisabled(false)
      setSkipping(false)
      setErrorMessage('Unable to add repositories, please try again.')
      // history.push('/onboarding/secondary-emails/');
    }
  }
  const onSkip = async () => {
    setSkipping(true)
    setDisabled(true)
    await postData('user/setIsOnboarded', { isOnboarded: true })
    MP.track(OnboardingEvents.SKIP_REPOSITORIES, {}, { send_immediately: true })
    window.location = '/onboarding/secondary-emails/'
  }

  const getBrowseListCount = () => {
    return repositoryList.length
  }

  useEffect(() => {
    if (repositoryList.length > 0 || repositoryExternalList.length > 0) {
      setDisabled(false)
      return
    }

    setDisabled(true)
  }, [repositoryList, repositoryExternalList])

  const preAdded = useMemo(() => {
    return [getDemoRepository(userData)]
  }, [userData])

  return (
    <>
      <StyledOnboardingText>
        You may add a maximum of {MAX_REPOSITORIES_PER_SELECTION} repositories to process.
      </StyledOnboardingText>
      <StyledSelectRepoContent>
        <StyledSelectRepoTitle>
          Browse Repositories
          {
            isSmUp && (
              <StyledHelpPopover
                content={`You can only add repositories under
                the username of your current account.
                We will support repositories in multiple usernames in the future.`}
              >
                <QuestionCircle
                  width='17.5'
                  height='17.5'
                />
              </StyledHelpPopover>
            )
          }
        </StyledSelectRepoTitle>
        <StyledSelectRepoBrowse />
        <BrowseRepositoriesList
          service={gitService}
          preSelected={repositoryList}
          externalRepoCount={repositoryExternalList.length}
          handleSelectedRepositories={() => {}}
          handleAddRepositories={handleAddRepositories}
          selectTop
        />
        <em>Or</em>
        <AddRepositoryByUrl
          setRepositoryExternalList={setRepositoryExternalList}
          currentRepositories={repositoryExternalList}
          service={gitService}
          user={userData}
          browseList={repositoryList}
          browseListCount={getBrowseListCount}
          preAdded={preAdded}
        />
      </StyledSelectRepoContent>
      {errorMessage && <Typography variant='body2' color='error' align='right'>{errorMessage}</Typography>}
      <OnboardingButtons
        confirm={onConfirm}
        back={onSkip}
        backDisabled={skipping}
        disabled={disabled}
        confirmText='Continue'
        backText='Skip'
      />

    </>
  )
}
