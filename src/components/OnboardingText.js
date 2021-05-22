import { smMedia } from '@/styles/snippets/responsive'
import styled from '@emotion/styled'

export const StyledOnboardingText = styled.div`
  font-size: var(--text-xs);
  display: block;
  text-decoration: none;
  color: var(--color-gray-500);

  ${smMedia(`
    font-size: var(--text-sm);
    font-weight: normal;
  `)}
`
