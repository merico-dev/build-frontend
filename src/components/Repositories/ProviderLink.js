import React from 'react'
import { Link, makeStyles, Tooltip } from '@material-ui/core'

import {
  getHostUrlByProjectUrl,
  getProviderByProjectUrl
} from '@/utils/repositories/projectUrl'
import ProviderIcon from '@/components/Repositories/ProviderIcon'

const useStyles = makeStyles(() => ({
  tooltip: {
    boxShadow: 'var(--elevation-1)',
    border: '0',
    padding: '3px 5px',
    borderRadius: 'var(--radius-xs)',
    background: '#fff',
    color: 'var(--color-gray-400)',
    fontSize: 'var(--text-xs)',
  },
  tooltipPlacementBottom: {
    margin: '5px 0 0'
  }
}))

export default function ProviderLink (props) {
  const {
    gitUrl,
    repositories,
    width,
    height,
    className,
    ProviderIconProps
  } = props

  const classes = useStyles()

  if (!gitUrl?.length || !repositories?.length) {
    return null
  }

  const repositoryObject = repositories.find(
    (repository) => repository.gitUrl === gitUrl
  )

  if (!repositoryObject) {
    return null
  }

  const hostUrl = getHostUrlByProjectUrl(repositoryObject.url)
  if (!hostUrl) {
    return null
  }

  const provider = getProviderByProjectUrl(repositoryObject.url)

  if (!provider) {
    return null
  }

  return (
    <Tooltip title={`Open in ${provider}`} classes={classes}>
      <Link href={hostUrl} className={className} target='_blank' rel='noreferrer'>
        <ProviderIcon
          provider={provider}
          width={width}
          height={height}
          {...ProviderIconProps}
        />
      </Link>
    </Tooltip>
  )
}
