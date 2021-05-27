/// <reference types="cypress" />

context('Productivity', () => {
  beforeEach(function () {
    cy.intercept('/productivityVelocity*range=all*').as('velocity');
    cy.intercept('/productivityOverview*range=all*').as('overview');
    cy.intercept('/productivityRanking*range=all*').as('ranking');
    cy.login();
    cy.fixture('repositories-test-data').then((data) => {
      this.testRepositories = data
      cy.visit(`/dashboard/productivity?gitUrl=${data["dashboard:singleRepository"].gitUrl}`);
    })
    cy.wait('@me');
  });

  it("should show the charts when the selected repository has data", function () {
    // select the range all time
    cy.get('[name=range][value=all]').click();
    // wait for all dashboard requests
    cy.wait([
      '@velocity',
      '@overview',
      '@ranking'
    ]);
    cy
      .get('[data-test=filter-select]')
      .should('contain.text', this.testRepositories["dashboard:singleRepository"].name);
    cy.get('[data-test=loading]').should('not.exist');
    // ranking item isn't empty
    cy.get('[data-test=empty-chart]').should('not.exist');
  })
});
