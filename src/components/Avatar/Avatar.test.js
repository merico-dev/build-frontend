import '@testing-library/jest-dom'

import React from 'react'
import { render } from '@testing-library/react'
import Avatar from './Avatar'

describe('Avatar', () => {
  describe('when no url is given', () => {
    test('renders icon default', () => {
      const { container } = render(<Avatar />)
      expect(container.getElementsByClassName('mockIcon')).toHaveLength(1)
    })
    test('shows correct aria label for icon avatar', () => {
      const { container } = render(<Avatar title='My label' />)
      expect(container.getElementsByClassName('mockIcon')[0])
        .toHaveAttribute('aria-label', 'My label')
    })
  })
  describe('when given an url', () => {
    test('renders avatar image', () => {
      const { container } = render(<Avatar url='https://example.com/none.jpg' />)
      expect(container.getElementsByTagName('img')).toHaveLength(1)
    })
    test('renders avatar image with correct alt attribute', () => {
      const { container } = render(
        <Avatar
          url='https://example.com/none.jpg'
          title='My Label'
        />
      )
      expect(container.getElementsByTagName('img')[0])
        .toHaveAttribute('alt', 'My Label')
    })
  })
})
