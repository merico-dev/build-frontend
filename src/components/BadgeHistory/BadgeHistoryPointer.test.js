import '@testing-library/jest-dom'

import React from 'react'
import { render, screen } from '@testing-library/react'
import BadgeHistoryPointer from './BadgeHistoryPointer'

describe('BadgeHistoryPointer', () => {
  it('returns an empty element when no grade was given ', () => {
    const { container } = render(
      <BadgeHistoryPointer grade='' />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the grade capitalized', () => {
    render(
      <BadgeHistoryPointer grade='SILVER' />
    )
    expect(screen.queryByText('Silver')).toBeInTheDocument()
  })

  it('position the badge correctly', () => {
    render(
      <BadgeHistoryPointer grade='SILVER' point='37' />
    )
    expect(screen.getByRole('mark')).toHaveStyle('left: 37%;')
  })
})
