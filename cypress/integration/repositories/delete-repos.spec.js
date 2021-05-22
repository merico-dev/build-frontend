/// <reference types="cypress" />

context('Delete repositories', () => {
  beforeEach(function () {
    cy.login();
    cy.visit('/repositories')
    cy.wait('@me');
    cy.fixture('repositories-test-data').then((data) => {this.testRepositories = data})
    cy.intercept({
      method: 'DELETE',
      pathname: '/project'
    }).as('deleteProject');
    cy.intercept({
      method: 'DELETE',
      pathname: '/projects'
    }).as('deleteMultipleProjects');
  });

  it("can delete a single repository", function () {
    cy
      .contains(this.testRepositories["delete-repos:single"])
      .parentsUntil('tbody')
      .find('[data-test=delete-repository]')
      .click()
    cy.wait('@deleteProject').its('response.statusCode').should('eq', 200);
    cy.contains(this.testRepositories["delete-repos:single"]).should('not.exist')
  });

  it("can delete a multiple repositories", function () {
    cy
      .contains(this.testRepositories["delete-repos:multiple"][0])
      .parentsUntil('tbody')
      .find('[data-test=check-repository]')
      .click()
    cy
    .contains(this.testRepositories["delete-repos:multiple"][1])
    .parentsUntil('tbody')
    .find('[data-test=check-repository]')
    .click()
    cy.contains('button', 'Delete').click();
    cy.get('[aria-label="Delete Repository Popup"]')
      .contains('button', 'Delete')
      .click();
    cy.wait('@deleteMultipleProjects').its('response.statusCode').should('eq', 200);
    cy.contains('#DeletedRepositoryMessage', 'The selected repositories have been deleted.');
    cy.contains(this.testRepositories["delete-repos:multiple"][0]).should('not.exist')
    cy.contains(this.testRepositories["delete-repos:multiple"][1]).should('not.exist')
  });
});
