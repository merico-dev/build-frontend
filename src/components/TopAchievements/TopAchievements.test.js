import '@testing-library/jest-dom'

import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TopAchievements from './TopAchievements'

describe('Top Achievements', () => {
  it('returns an empty element when no achievements are given', () => {
    const { container } = render(
      <TopAchievements />,
      { wrapper: MemoryRouter }
    )
    expect(container).toBeEmptyDOMElement()
  })
  it('returns an empty element when an empty list was given', () => {
    const { container } = render(
      <TopAchievements achievements={[]} />,
      { wrapper: MemoryRouter }
    )
    expect(container).toBeEmptyDOMElement()
  })
  it('shows the achievement language only', () => {
    render(
      <TopAchievements achievements={[
        { rankNumerator: 1000, name: 'Linguist for Rust' }
      ]}
      />,
      { wrapper: MemoryRouter }
    )
    expect(screen.queryByText('Rust', { exact: true })).toBeInTheDocument()
    expect(screen.queryByText('Linguist for Rust', { exact: true })).not.toBeInTheDocument()
  })
  /**
   * This test overlaps with linguist.test.js but it's here to assure the right props
   * and prevent regression
   * @see src/utils/badges/linguist.test.js
   * @see https://gitlab.com/merico-dev/ce/ce-all/-/issues/601#note_498995240
   */
  it('shows the percentage based on thresholds', () => {
    render(
      <TopAchievements achievements={[
        { rankNumerator: 82.5, name: 'Linguist for JavaScript' }
      ]}
      />,
      { wrapper: MemoryRouter }
    )
    expect(screen.queryByText('Top 17.5%')).toBeInTheDocument()
  })
  it('shows the percentage in a readable way', () => {
    render(
      <TopAchievements achievements={[
        { rankNumerator: 20.51234, name: 'Linguist for JavaScript' }
      ]}
      />,
      { wrapper: MemoryRouter }
    )
    expect(screen.queryByText('Top 50.5%')).toBeInTheDocument()
  })
  it('shows 99% rank when language is unknown', () => {
    render(
      <TopAchievements achievements={[
        { rankNumerator: 1, name: 'Linguist for NotARealLanguage' }
      ]}
      />,
      { wrapper: MemoryRouter }
    )
    expect(screen.queryByText('Top 99%')).toBeInTheDocument()
  })
  it('shows the number of ELOCS for the achievement', () => {
    render(
      <TopAchievements achievements={[
        { rankNumerator: '3000', name: 'Linguist for Rust' }
      ]}
      />,
      { wrapper: MemoryRouter }
    )
    expect(screen.queryByText('3000 ELOCs')).toBeInTheDocument()
  })
})
