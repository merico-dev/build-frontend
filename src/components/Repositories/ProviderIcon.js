import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as GitlabCircular } from '@/icons/gitlab-circular.svg'
import providers from '@/enums/providers'

const StyledProviderIcon = styled.div`
  ${({ width, height }) => {
    return `
      width: ${width}px;
      height: ${height}px;
    `
  }}
`

export default function ProviderIcon (props) {
  const {
    provider,
    width,
    height,
    className
  } = props

  switch (provider) {
    case providers.GITLAB:
      return (
        <StyledProviderIcon width={width} height={height} className={className}>
          <GitlabCircular width={width} height={height} />
        </StyledProviderIcon>
      )
    case providers.GITHUB:
      return (
        <StyledProviderIcon width={width} height={height} className={className}>
          <Github width={width} height={height} />
        </StyledProviderIcon>
      )
    default:
      return null
  }
}
