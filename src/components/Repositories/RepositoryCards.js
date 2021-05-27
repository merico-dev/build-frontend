import { lgMedia, mdMedia, smMedia } from '@/styles/snippets/responsive'
import styled from '@emotion/styled'
import React from 'react'
import RepositoryCard from '@/components/Repositories/RepositoryCard'

const StyledRepositoryCards = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;

  ${smMedia(`
    grid-template-columns: repeat(2, minmax(290px, 1fr));
  `)}

  ${mdMedia(`
    grid-template-columns: repeat(3, minmax(290px, 1fr));
  `)}

  ${lgMedia(`
    grid-template-columns: repeat(4, minmax(200px, 1fr));
  `)}
`

export default function RepositoryCards (props) {
  const {
    repositories = []
  } = props

  return (
    <StyledRepositoryCards data-test='repository-cards'>
      {
        repositories.map((repository, index) => (
          <div key={index}>
            <RepositoryCard repository={repository} />
          </div>
        ))
      }
    </StyledRepositoryCards>
  )
}
