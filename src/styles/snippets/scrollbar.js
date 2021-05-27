import { css } from '@emotion/core'

const scrollbar = (props) => (css`
  overflow-y: auto;

  ::-webkit-scrollbar {
    transition: all .3s;
    width: ${props.width};
    background-color: transparent;
    padding-left: 8px;
  }
  &:hover {
    ::-webkit-scrollbar {
      padding-left: 0px;
    }
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--color-primary-400);
    border-radius: 6px;

    &:hover {
      background-color: var(--color-primary-300);
    }
  }
`)

export default scrollbar
