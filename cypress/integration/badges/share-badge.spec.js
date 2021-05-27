context('Share A Badge', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/badges')
    cy.intercept('/badge/95').as('badge')
  })

  it('allows user to share a badge', () => {
    const firstBadge = cy.get('img[src*="https://merico-build.s3-us-west-2.amazonaws.com/badges/"').first()
    firstBadge.should('exist')
    firstBadge.click()
    cy.url().should('include', '/badges/assertion')
    cy.wait('@badge')
    cy.get('button').contains('Share').click()
    cy.get('div[role="dialog"]').should('exist')
    cy.get('h2').contains('Share').should('exist')
  })

})
