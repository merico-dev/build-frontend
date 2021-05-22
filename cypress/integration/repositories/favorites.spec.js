const { wait } = require("@testing-library/react")

context('Favorites', () => {

  beforeEach(function () {
    cy.login()
    // DISABLE LEGACY FAVORITE REPO TEST
    // cy.fixture('repositories-test-data').then((data) => {this.testRepositories = data})
    // cy.visit('/dashboard')
    // cy.intercept('/setFavoriteRepos').as('setFavoriteRepos')
  })

  it('add favorite repository (legacy/bypassed)', function () {
    // DISABLE LEGACY FAVORITE REPO TEST
    // cy.get('[data-test=add-favorite-repositories]').click()
    // cy.contains('Dev Share Preference').should('exist')
    // cy
    //   .get('[data-test=select-repositories-dialog-repositories]')
    //   .contains(this.testRepositories["favorites:add"])
    //   .find('input')
    //   .click()
    // cy.contains('Confirm Selection').click()
    // cy.wait('@setFavoriteRepos').its('response.statusCode').should('eq', 200)
    // cy.get('[data-test=repository-labels]').should('contain.text', this.testRepositories["favorites:add"])
  })

})
