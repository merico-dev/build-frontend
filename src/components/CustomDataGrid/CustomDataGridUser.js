import React from 'react'
import styled from '@emotion/styled'
// import { Link } from 'react-router-dom'
import Avatar from '@/components/Avatar/Avatar'

const StyledUserColumn = styled.div`
  display: flex;
  align-items: center;
`
const StyledUserName = styled.a`
  font-size: var(--text-md);
  color: var(--color-primary-400);
  font-weight: var(--text-semibold);
  text-decoration: none;
  margin-left: 10px;
  ${({ clickable }) => (clickable === 'yes' && `
    cursor: pointer;
  `)}  
`

export default function CustomDataGridUser (props) {
  const {
    name,
    photo,
    email,
    onClick = () => {},
    disableClick = false,
    clickable = false
  } = props

  return (
    <StyledUserColumn>
      <Avatar url={photo} title={name} size='40px' iconSize={20} />
      <StyledUserName
        disabled={disableClick}
        clickable={clickable && !disableClick ? 'yes' : 'no'}
        onClick={(e) => onClick(email, name, e)}
      >
        {name}
      </StyledUserName>
    </StyledUserColumn>
  )
}
