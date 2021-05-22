/// <reference types="cypress" />

context('Add repositories', () => {
  beforeEach(function () {
    cy.login()
    cy.fixture('repositories-test-data').then((data) => {this.testRepositories = data})
    cy.visit('/repositories')
    cy.wait('@me')
    cy.intercept('POST', '/projects').as('projectsPost')
    cy.intercept('GET', '/projects').as('projects')
    cy.intercept('GET', '/repos/github*').as('repositories')
    cy.intercept('GET', '/impactOverview*').as('impact')
  })

  it("cannot add a repository that was already added", function () {
    cy.contains('button', 'Add New').click()
    cy.contains('button', 'Browse GitHub').click()
    cy.wait('@repositories')
    cy.get('#RepositorySearch').type(this.testRepositories["add-repo:alreadyExist"])
    cy.get('[data-test="browse-repository-check"] input').should('have.attr', 'disabled')
  })

  it("can add a new repository", function ()  {
    cy.contains('button', 'Add New').click()
    cy.contains('button', 'Browse GitHub').click()
    cy.wait('@repositories')
    cy.get('#RepositorySearch').type(this.testRepositories["add-repo:single"])
    cy.get('[data-test="browse-repository-check"]').click()
    cy.get('#ConfirmBrowseRepositorySelection').click()
    cy.get('#AddRepositoryButton').click()
    cy.wait('@projectsPost').its('response.statusCode').should('eq', 200)
    cy.contains('Your repositories have been successfully imported!')
    cy.contains('button', 'OK').click()
    cy.wait(300)
    cy.contains('a', 'Progress').click()
    cy.url().should('include', 'progress')
    cy.wait('@impact')
    cy.get('[data-test="filter-select"]').click()
    cy.wait(300)
    cy
      .contains(this.testRepositories["add-repo:single"])
      .should('be.visible')
  })
})
