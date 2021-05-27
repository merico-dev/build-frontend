import { css } from '@emotion/core'

export const smMedia = (content) => {
  return css`
    @media screen and (min-width: 600px) {
      ${content}
    }
  `
}

export const mdMediaDown = (content) => {
  return css`
    @media screen and (max-width: 960px) {
      ${content}
    }
  `
}

export const mdMedia = (content) => {
  return css`
    @media screen and (min-width: 960px) {
      ${content}
    }
  `
}

export const lgMedia = (content) => {
  return css`
    @media screen and (min-width: 1280px) {
      ${content}
    }
  `
}
