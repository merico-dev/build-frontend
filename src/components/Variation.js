/** @jsx jsx */
import { jsx, css } from '@emotion/core'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { ReactComponent as Arrow } from '@/icons/vertical-arrow.svg'

export default function Variation (props) {
  const {
    variation,
    positive,
    children,
    arrowSize = 12
  } = props

  if (variation === 0) {
    return (
      <span>
        {children}
      </span>
    )
  }

  const symbol = positive
    ? (
      <Arrow
        css={css`
        transform: scaleY(-1);
        margin-right: 4px;
      `}
        width={arrowSize}
        height={arrowSize}
      />
      )
    : (
      <Arrow
        css={css`
        margin-right: 4px;
      `}
        width={arrowSize}
        height={arrowSize}
      />
      )

  return (
    <span
      css={css`
      color: ${positive ? 'var(--color-green-500)' : 'var(--color-primary-400)'};
    `}
    >
      {symbol}
      {children}
    </span>
  )
}
