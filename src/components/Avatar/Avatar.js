import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { ReactComponent as User } from '@/icons/user.svg'

const StyledAvatar = styled.div`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  justify-content: center;
  align-items: center;
  background: var(--color-gray-300);
  color: #fff;
  border-radius: 50%;
  display: inline-flex;
  overflow: hidden;

  ${({ color }) => (color === 'primary'
  ? css`
    color: var(--color-primary-400);
    background-color: #FFF3EB;
  `
  : null)}

  ${({ boxElevation }) => (boxElevation > 0 && `
    box-shadow: var(--elevation-${boxElevation});
  `)}
  
`

const StyledImage = styled.img`
  -o-object-fit: contain;
  object-fit: contain;
  height: 100%;
  max-width: 100%;
`

export default function Avatar (props) {
  const {
    url,
    title,
    size = '32px',
    iconSize = '18',
    iconHeight,
    className,
    icon,
    color = 'gray',
    boxElevation = 1
  } = props

  const AvatarIcon = icon ?? (
    <User
      width={iconSize}
      height={iconHeight ?? iconSize}
      aria-label={title}
    />
  )

  return (
    <StyledAvatar
      size={size}
      className={className}
      color={color}
      boxElevation={boxElevation}
    >
      {url ? <StyledImage src={url} alt={title} /> : AvatarIcon}
    </StyledAvatar>
  )
}
