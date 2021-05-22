import scrollbar from '@/styles/snippets/scrollbar'
import styled from '@emotion/styled'

const StyledRepositoryList = styled.div`
  padding: 16px 20px 20px;
  font-size: var(--text-md);
  color: var(--color-gray-500);
  min-height: 125px;
  max-height: 382px;
  height: calc(100vh - ${({ outsideSpace }) => outsideSpace ?? '370px'});
  background-color: #FFF3EB;
  margin: 25px 0 40px;
  ${({ marginTop }) => (marginTop && `margin-top: ${marginTop};`)}
  ${({ marginLess }) => (marginLess ? 'margin: 0;' : '')}
  ${scrollbar({ width: '12px' })}

  &.empty {
    color: var(--color-gray-300);
  }

  &.embedded {
    background-color: #ffffff;
    max-height: 233px;
  }
`

export default StyledRepositoryList
