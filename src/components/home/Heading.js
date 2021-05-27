import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { mdMedia, mdMediaDown } from '@/styles/snippets/responsive'

export const StyledTitle = styled.h3`
  color: var(--color-primary-400);
  font-size: var(--text-xl);
  text-align: center;
  margin-top: 0;
  margin-bottom: ${({ bottom = 0 }) => bottom}px;

  ${mdMedia(css`
    font-size: 2.625rem;
  `)}

  ${mdMediaDown(css`
    margin-bottom: 24px;
  `)}
`

export const StyledSubtitle = styled.h3`
  font-weight: var(--text-semibold);
  color: var(--color-gray-500);
  font-size: 1.375rem;
  margin-bottom: ${({ bottom = 0 }) => bottom}px;
  text-align: ${({ align = 'left' }) => align};
  min-height: ${({ height }) => (height ? `${height}px` : '0')};

  ${mdMedia(css`
    font-size: var(--text-xl);
  `)}

  ${mdMediaDown(css`
    min-height: 0;
  `)}
`
