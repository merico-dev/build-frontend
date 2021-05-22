import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import {
  Typography,
  Button,
  makeStyles,
  TextField
} from '@material-ui/core'

import { ReactComponent as Trash } from '@/icons/trash.svg'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle-color.svg'

import HelpPopover from '@/components/HelpPopover'
import { getServiceProvider, getDemoRepository } from '@/utils/user/user'
import { smMedia } from '@/styles/snippets/responsive'
import { MAX_REPOSITORIES_PER_SELECTION } from '@/enums/repositories'

const useStyles = makeStyles((theme) => ({
  h2: {
    marginTop: 0
  },
  h3: {
    fontSize: 'var(--text-xl)',
    color: 'var(--color-gray-500)',
    marginRight: 'auto',
    [theme.breakpoints.down('xs')]: {
      fontSize: 'var(--text-md)',
    }
  },
  defaultItemUrl: {
    borderBottom: 'solid 2px',
    color: 'var(--color-gray-400)',
    marginBottom: '8px'
  }
}))

const StyledExternalRepositoryUrlList = styled.div`
  margin-bottom: 10px;
  margin-top: 10px;
  border-radius: 4px;
  font-size: var(--text-md);

  &.empty {
    display:none
  }

  &.outlined {
    border: 1px solid var(--color-gray-400);
    background-color: #ffffff;
  }
`

const StyledRepositoryUrlItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 32px;
  padding: 8px 14px;
  background: var(--color-primary-400);
  ${smMedia(`
    background: #fff;
  `)}
`

const StyledRepositoryUrlDefaultItem = styled.div`
  padding: 8px 0;
`

const StyledTrash = styled(Trash)`
  color: #B1B5CB;
  cursor: pointer;
  margin: auto 0;
  margin-left: 20px;
  vertical-align: middle;
`

const StyledRepositoryName = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const StyledHelpPopover = styled(HelpPopover)`
  margin-left: 5px;
  color: var(--color-gray-400);

  &.dialog-mode {
    color: var(--color-brand-50);
  }
`

function RepositoryUrlItem (props) {
  const {
    url,
    onTrash,
    user
  } = props

  const classes = useStyles()

  if (url === getDemoRepository(user)) {
    return (
      <StyledRepositoryUrlDefaultItem data-test='external-repo-list-item'>
        <Typography variant='body1' className={classes.defaultItemUrl}>{url}</Typography>
        <Typography variant='body2'>
          *An example repository will be automatically added
          to your account for demo purposes. You can remove it later.
        </Typography>
      </StyledRepositoryUrlDefaultItem>
    )
  }

  return (
    <StyledRepositoryUrlItem data-test='external-repo-list-item'>
      <StyledRepositoryName>{url}</StyledRepositoryName>
      <StyledTrash
        data-test='external-repo-delete-icon'
        width='11'
        height='11'
        onClick={() => onTrash(url)}
      />
    </StyledRepositoryUrlItem>
  )
}

export default function AddRepositoryByUrl (props) {
  const {
    user,
    dialogMode = false,
    browseList = [],
    browseListCount,
    setRepositoryExternalList,
    currentRepositories,
    preAdded = []
  } = props
  const classes = useStyles()
  const [repositoryUrlList, setRepositoryUrlList] = useState([])
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [repositoryUrlHelperText, setRepositoryUrlHelperText] = useState('')

  const serviceProvider = getServiceProvider(user)

  useEffect(() => {
    if (preAdded?.length > 0) {
      setRepositoryUrlList((current) => (
        [
          ...current.filter(url => url !== getDemoRepository(user)),
          ...preAdded,
        ]
      ))
    }
  }, [preAdded, user])

  const maxReposAdded = (browseCount, selectedCount) => {
    return parseInt(Math.max(0, browseCount) + selectedCount, 10) >= MAX_REPOSITORIES_PER_SELECTION
  }

  const wasAlreadyImported = (url) => {
    return currentRepositories?.data?.some((currentRepo) => currentRepo.gitUrl === url)
  }

  const wasSelectedByBrowser = (url) => {
    return browseList.some((browseRepo) => browseRepo.gitUrl === url)
  }

  const isValidProviderUrl = (url) => {
    return url.includes(serviceProvider)
  }

  const isRepoAlreadyChosen = (url) => {
    const repoParts = url.split('/').reverse()
    const repoOwner = repoParts[0]
    const repoName = repoParts[1]
    const isSimilarRepo = repositoryUrlList.some(
      (repo) => repo.includes(repoOwner) && repo.includes(repoName)
    )
    return repositoryUrlList.includes(url) || isSimilarRepo
  }

  const isValidGitUrl = (url) => {
    return url !== '' &&
      url.endsWith('.git') &&
      (
        url.startsWith('git@') ||
        url.startsWith('git://') ||
        url.startsWith('http') ||
        url.startsWith('ssh')
      )
  }

  const isValidRepositoryUrl = (url) => {
    const validUrl = isValidGitUrl(url)
    return validUrl && isValidProviderUrl(url) && !isRepoAlreadyChosen(url)
  }

  const changeRepositoryUrl = (url) => {
    setRepositoryUrl(url)
    if (
      url === '' ||
      (
        url !== '' &&
        !wasAlreadyImported(url) &&
        !wasSelectedByBrowser(url) &&
        isValidRepositoryUrl(url) &&
        isValidProviderUrl(url) &&
        !maxReposAdded(browseListCount(), repositoryUrlList.length)
      )
    ) {
      setRepositoryUrlHelperText('')
    } else if (url !== '' && !isValidGitUrl(url)) {
      setRepositoryUrlHelperText('Only Valid Git URLs Allowed.')
    } else if (url !== '' && !isValidProviderUrl(url) && !isRepoAlreadyChosen(url)) {
      setRepositoryUrlHelperText(`Service Provider does not match your account (${serviceProvider}).`)
    } else if (url !== '' && isRepoAlreadyChosen(url)) {
      setRepositoryUrlHelperText('Repository already added for processing.')
    } else if (maxReposAdded(browseListCount(), repositoryUrlList.length)) {
      setRepositoryUrlHelperText('Max repositories added.')
    } else if (url !== '' && wasAlreadyImported(url)) {
      setRepositoryUrlHelperText('This URL appears to be an existing project.')
    } else if (url !== '' && wasSelectedByBrowser(url)) {
      setRepositoryUrlHelperText('This URL is already selected by the browser list.')
    } else {
      setRepositoryUrlHelperText('Only Valid Git URLs Allowed.')
    }
  }

  const handleAddRepositoryURL = () => {
    if (repositoryUrl !== '' && !repositoryUrlList.includes(repositoryUrl)) {
      setRepositoryUrlList([...repositoryUrlList, repositoryUrl])
      setRepositoryUrl('')
    }
  }

  const removeRepository = useCallback((repository) => {
    setRepositoryUrlList((currentList) => {
      return currentList.filter((url) => url !== repository)
    })
  }, [setRepositoryUrlList])

  const addGitUrlExtension = (url) => {
    if (url && url !== '' && (url.startsWith('http') || url.startsWith('git@')) && !url.endsWith('.git')) {
      // eslint-disable-next-line no-param-reassign
      url = [url, '.git'].join('')
      changeRepositoryUrl(url)
    }
  }

  const repositoryListClasses = `${repositoryUrlList.length === 0 ? 'empty' : ''} ${dialogMode ? 'outlined' : ''}`

  useEffect(() => {
    // isMountedRef.current = true;
    // if (isMountedRef.current) {
    const processedUrlList = repositoryUrlList.map((url) => {
      // BE cannot accept Github & Gitlab SSH URLs as gitUrl, convert to HTTPS...
      if (serviceProvider === 'github' && url.startsWith('git@github.com:')) {
        // eslint-disable-next-line no-param-reassign
        url = url.replace('git@github.com:', 'https://github.com/')
      }
      if (serviceProvider === 'gitlab' && url.startsWith('git@gitlab.com:')) {
        // eslint-disable-next-line no-param-reassign
        url = url.replace('git@gitlab.com:', 'https://gitlab.com/')
      }
      const urlParts = url.replace('.git', '').split('/')
      const projectName = urlParts[urlParts.length - 1]
      const username = urlParts[urlParts.length - 2]
      const repo = {
        alreadyAdded: false,
        gitUrl: url,
        name: projectName,
        provider: serviceProvider,
        url: `https://api.github.com/repos/${username}/${projectName}`,
      }
      return repo
    })
    setRepositoryExternalList(processedUrlList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositoryUrlList])

  return (
    <div style={{ marginTop: '17px' }}>
      <Typography
        variant='h3'
        className={classes.h3}
      >
        Add by URL
        <StyledHelpPopover
          className={dialogMode ? 'dialog-mode' : ''}
          content='Enter a valid public Git URL.'
        >
          <QuestionCircle
            width='17.5'
            height='17.5'
          />
        </StyledHelpPopover>
      </Typography>
      <StyledExternalRepositoryUrlList className={repositoryListClasses} data-test='external-repo-list'>
        {
          repositoryUrlList.map((url, idx) => (
            <RepositoryUrlItem
              key={idx}
              url={url}
              onTrash={removeRepository}
              user={user}
            />
          ))
        }
      </StyledExternalRepositoryUrlList>
      <TextField
        error={
          (repositoryUrl !== '' && !isValidRepositoryUrl(repositoryUrl)) ||
          wasAlreadyImported(repositoryUrl) ||
          wasSelectedByBrowser(repositoryUrl) ||
          maxReposAdded(browseListCount(), repositoryUrlList.length)
        }
        label='Repository URL'
        id='RepositoryURL'
        data-test='input#RepositoryURL'
        value={repositoryUrl}
        onBlur={({ target }) => addGitUrlExtension(target.value)}
        onMouseOut={({ target }) => addGitUrlExtension(target.value)}
        onChange={({ target }) => changeRepositoryUrl(target.value)}
        fullWidth
        helperText={repositoryUrlHelperText}
      />
      <Button
        style={{ marginTop: '12px' }}
        variant='contained'
        size='small'
        color='primary'
        onClick={handleAddRepositoryURL}
        disabled={
          !isValidRepositoryUrl(repositoryUrl) ||
          wasAlreadyImported(repositoryUrl) ||
          wasSelectedByBrowser(repositoryUrl) ||
          maxReposAdded(browseListCount(), repositoryUrlList.length)
        }
      >Add URL
      </Button>
    </div>

  )
}
