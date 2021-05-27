import React from 'react'
import styled from '@emotion/styled'

import scrollbar from '@/styles/snippets/scrollbar'
import { ReactComponent as Trash } from '@/icons/trash.svg'

const StyledRepositoryItem = styled.div`
  display: flex;
  margin-bottom: 4px;
`

const StyledRepositoryItemLabel = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inlne-block;
  overflow: hidden;
  max-width: 300px;
`

const StyledTrash = styled(Trash)`
  color: #B1B5CB;
  margin-left: auto;
  cursor: pointer;
`

const StyledRepositoryList = styled.div`
  padding: 8px 14px;
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  height: 131px;
  background-color: #FFF3EB;
  border-radius: 4px;
  margin-top: 20px;
  ${scrollbar({ width: '8px' })}

  &.empty {
    color: var(--color-gray-300);
  }

  &.outlined {
    border-radius: 4px;
    border: 1px solid #717484;
    background-color: #ffffff;
  }

`

function getRepositories (
  repositoryList,
  selectedService,
  removeRepository
) {
  if (selectedService) {
    return Object.keys(repositoryList).map((service) => (
      repositoryList[service].map((repository) => (
        <StyledRepositoryItem key={repository.url}>
          <StyledRepositoryItemLabel>{repository.name}</StyledRepositoryItemLabel>
          <StyledTrash
            width='11'
            height='11'
            onClick={() => removeRepository(repository.url, service)}
          />
        </StyledRepositoryItem>
      ))
    ))
  }

  return repositoryList.map((repository) => (
    <StyledRepositoryItem key={repository.url}>
      <StyledRepositoryItemLabel>{repository.name}</StyledRepositoryItemLabel>
      <StyledTrash
        width='11'
        height='11'
        onClick={() => removeRepository(repository.url, selectedService)}
      />
    </StyledRepositoryItem>
  ))
}

export default function SelectedRepositories (props) {
  const {
    repositoryList,
    removeRepository,
    selectedService = false,
    className,
    dialogMode = false
  } = props

  const selectedRepositoryList = Object.keys(repositoryList).length
    ? (
        getRepositories(repositoryList, selectedService, removeRepository)
      )
    : 'Added repositories will be shown here.'

  const mergedClassNames = `${className} ${!repositoryList.length ? 'empty' : ''} ${dialogMode ? 'outlined' : ''}`

  return (
    <StyledRepositoryList className={mergedClassNames}>
      {selectedRepositoryList}
    </StyledRepositoryList>
  )
}
