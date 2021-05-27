/// <reference types="cypress" />

context('Quality', () => {
  beforeEach(function () {
    cy.intercept('/reportMetrics*range=all*').as('report');
    cy.login();
    cy.fixture('repositories-test-data').then((data) => {
      this.testRepositories = data
      cy.visit(`/dashboard/quality?gitUrl=${data["dashboard:singleRepository"].gitUrl}`);
    })
    cy.wait('@me');
  });

  it("should show the charts when the selected repository has data", function () {
    // select the range all time
    cy.get('[name=range][value=all]').click();
    // wait for all dashboard requests
    cy.wait([
      '@report'
    ]);
    cy
      .get('[data-test=filter-select]')
      .should('contain.text', this.testRepositories["dashboard:singleRepository"].name);
    cy.get('[data-test=loading]').should('not.exist');
    // ranking item isn't empty
    cy.get('[data-test=empty-chart]').should('not.exist');
  })
});
