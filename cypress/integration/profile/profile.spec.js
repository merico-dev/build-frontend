context('Public Profile', () => {
  beforeEach(function () {
    cy.login()
    cy.fixture('repositories-test-data').then((data) => {this.testRepositories = data})
  })
  context('Profile 404', () => {
    it('shows 404 when profile does not exist', () => {
      cy.visit('/profile/999999')
      cy.contains('404')
    })

    it('shows 404 when no profile id is given', () => {
      cy.visit('/profile')
      cy.contains('404')
    })
  })
  context('Profile Found', () => {
    beforeEach(function () {
      cy.visit('/profile/47')
      cy.intercept('/publicProfile/47').as('profile47')
      cy.wait('@profile47')
    })

    it('shows all users repositories', function () {
      cy.contains('h2', 'Repositories').should('be.visible')
      cy.contains(
        '[data-test=repository-cards]',
        this.testRepositories["add-repo:alreadyExist"]
      ).should('be.visible')
    })

    it('show users informations', () => {
      cy.contains('[data-test=developer-card]', 'rosa-merico-e2e').should('be.visible')
      cy.contains('[data-test=developer-card]', 'MericoE2E@merico.gonze.com').should('be.visible')
    })

    // TODO: This test is still failing from time to time. We need to improve it's stability
    // @see https://gitlab.com/merico-dev/ce/ce-frontend/-/jobs/1081714852
    it.skip('shows badges, top achievements and top contributions components', () => {
      // waits for the media query check to load
      cy.waitFor('200')
      cy.contains('h2', 'Badges').should('be.visible')
      cy.contains('Top Achievements').should('be.visible')
      cy.contains('Top Contributions').should('be.visible')
    })
  })
})
