import styled from '@emotion/styled'

const StyledLineChart = styled.div`
  width: 100%;
  ${({ height }) => (
    `height: ${height}px;`
  )}
  position: relative;

  & .recharts-tooltip-wrapper {
    border: 1px solid var(--color-gray-300) !important;
    border-radius: var(--radius-lg) !important;
    box-shadow:  var(--elevation-1) !important;
    background: #fff !important;
    overflow: hidden;
    padding: 2px 10px 5px;
    font-size: var(--text-xs);
    color: var(--color-gray-400);

    > div > table {
      display: none;
    }
    > div > span {
      text-align: right;
      color: var(--color-gray-400);
    }
  }

  & .recharts-area-dots {
    display: none;
  }
`

export default StyledLineChart
