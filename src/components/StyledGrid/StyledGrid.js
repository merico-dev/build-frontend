import { lgMedia } from '@/styles/snippets/responsive'
import styled from '@emotion/styled'

const StyledGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  margin: 0 -7px 0;
  ${({ marginBottom }) => marginBottom && `margin-bottom: ${marginBottom}px;`}
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop}px;`}

  ${lgMedia(`
    grid-template-columns: 1fr 1fr;
  `)}
`

const StyledGridItem = styled.div`
  display: flex;
  flex-direction: column;
  /* this is needed in order to make responsive bar chart work */
  overflow: hidden;
  padding: 7px;
`

export {
  StyledGrid,
  StyledGridItem
}
