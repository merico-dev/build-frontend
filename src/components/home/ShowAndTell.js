import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { mdMedia } from '@/styles/snippets/responsive'

export const ShowAndTellWrapper = styled.div`
  ${({ dark }) => dark && 'background-color: var(--color-background-600);'}
  padding: 30px 20px;

  ${mdMedia(css`
    padding: 60px 20px;
  `)}
`

export const ShowAndTellContent = styled.div`
  max-width: 1140px;
  margin: 0 auto;
`

export const ShowAndTellItem = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  margin-top: 15px;
  grid-template-columns: 1fr;

  ${mdMedia(css`
    grid-template-columns: minmax(50%, 540px) 1fr;
  `)}

  img {
    max-width: 100%;
    width: 300px;
    grid-row-start: 1;

    ${mdMedia(css`
      grid-row-start: auto;
      max-width: 100%;
      width: auto;
  `)}
  }
`

export const ShowAndTellText = styled.p`
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  line-height: 1.4;

  ${mdMedia(css`
    font-size: var(--text-md);
  `)}
`
