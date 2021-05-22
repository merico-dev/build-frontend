/// <reference types="cypress" />

context('Repository overview', () => {
  beforeEach(function () {
    cy.intercept('/devValueByTeam*range=all*').as('devShare');
    cy.intercept('/multipleProductivityOverview*range=all*').as('productivity');
    cy.intercept('/multipleImpactOverview*range=all*').as('impact');
    cy.intercept('/multipleReportMetrics*range=all*').as('quality');
    cy.login();
    cy.fixture('repositories-test-data').then((data) => {
      this.testRepositories = data
      cy.visit(`/repository/overview?gitUrl=${data["dashboard:singleRepository"].gitUrl}`);
    })
    cy.wait('@me');
  });

  it("should show the charts when the selected repository has data", function () {
    // select the range all time
    cy.get('[name=range][value=all]').click();
    // wait for all dashboard requests
    cy.wait([
      '@devShare',
      '@productivity',
      '@impact',
      '@quality'
    ]);
    cy
      .get('[data-test=filter-select]')
      .should('contain.text', this.testRepositories["dashboard:singleRepository"].name);
    cy.get('[data-test=loading]').should('not.exist');
    // ranking item isn't empty
    cy.get('[data-test=empty-chart]').should('not.exist');
  })
});
