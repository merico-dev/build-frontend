context('List All Badges', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/badges')
  })

  it('shows all user badges', () => {
    cy.get('h1').contains('Badges').should('exist')
    const allBadges = cy.get('img[src*="https://merico-build.s3-us-west-2.amazonaws.com/badges/"]')
    cy.get('img[src*="https://merico-build.s3-us-west-2.amazonaws.com/badges/"]:first').parent().should('have.attr', 'href').and('match', /badges\/assertion/)
  })

  it('displays badge grade legend indicators', () => {
    cy.get('div[color="#F9CE78"]').contains('Top 10%').should('exist')
    cy.get('div[color="#DEDFE3"').contains('Top 10-25%').should('exist')
    cy.get('div[color="#EDB494"').contains('Top 25-50%').should('exist')
    cy.get('div[color="#B2B4BD"').contains('Top 50-80%').should('exist')
  })

  it('allows user to explore badges help page', () => {
    const exploreButton = cy.get('button.MuiButton-containedPrimary').contains('Explore Badges')
    exploreButton.should('exist')
    exploreButton.click()
    cy.url().should('include', 'help#badges')
    // cy.wait(5000)
    cy.visit('/badges')
  })

  it('allows user to view badge assertion page (details)', () => {
    const firstBadge = cy.get('img[src*="https://merico-build.s3-us-west-2.amazonaws.com/badges/"').first()
    firstBadge.should('exist')
    firstBadge.click()
    cy.url().should('include', '/badges/assertion')
  })

  
})