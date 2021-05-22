import React from 'react'
import styled from '@emotion/styled'

const StyledTextInputWrapper = styled.div`
  display: inline-flex;
  display: relative;
  justify-content: center;
  align-items: center;
  position: relative;
`
const StyledTextInput = styled.input`
  background: var(--color-background-100);
  border: 1px solid var(--color-primary-400);
  border-radius: var(--radius-xs);
  padding: 10px;

  ${({ hasIcon }) => (hasIcon && 'padding-right: 35px;')}

  &:focus {
    border-color: var(--color-primary-500);
    outline: none;
    box-shadow: var(--elevation-1);
  }
`
const StyledIconWraper = styled.span`
  position: absolute;
  right: 0;
  margin-right: 10px;
  color: var(--color-primary-500);
  width: 20px;
  overflow: hidden;
`

export default function TextInput (props) {
  const {
    icon,
    wrapperClassName,
    ...inputProps
  } = props

  return (
    <StyledTextInputWrapper className={wrapperClassName}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <StyledTextInput {...inputProps} hasIcon={!!icon} />
      <StyledIconWraper>
        {icon}
      </StyledIconWraper>
    </StyledTextInputWrapper>
  )
}
