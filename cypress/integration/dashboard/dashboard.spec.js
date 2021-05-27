/// <reference types="cypress" />

context('Legacy Dashboard', () => {
  // LEGACY DASHBOARD HOME (DISABLED)
  // @todo: Remove on Legacy Cleanup
  // beforeEach(function () {
  //   cy.intercept('/devValueByTeam*range=all*').as('devShare');
  //   cy.intercept('/devValueByRanking*range=all*').as('devShareRanking');
  //   cy.intercept('/multipleProductivityOverview*range=all*').as('productivity');
  //   cy.intercept('/multipleImpactOverview*range=all*').as('impact');
  //   cy.intercept('/multipleReportMetrics*range=all*').as('quality');
  //   cy.fixture('repositories-test-data').then((data) => {this.testRepositories = data})
  //   cy.login();
  //   cy.visit('/dashboard');
  //   cy.wait('@me');
  // });

  // it("should show the charts when a favorited repository has data", function () {
  //   // select the range all time
  //   cy.get('[name=range][value=all]').click();
  //   // wait for all dashboard requests
  //   cy.wait([
  //     '@devShare',
  //     '@devShareRanking',
  //     '@productivity',
  //     '@impact',
  //     '@quality'
  //   ]);
  //   cy
  //     .get('[data-test=repository-labels]')
  //     .should('contain.text', this.testRepositories["dashboard:isFavorited"]);
  //   cy.get('[data-test=loading]').should('not.exist');
  //   // ranking item isn't empty
  //   cy
  //     .get(`[data-test=ranking-item-${this.testRepositories["dashboard:isFavorited"]}]`)
  //     .find('[data-test=dev-value-ranking-empty]')
  //     .should('not.exist');
  //   cy.get('[data-test=empty-chart]').should('not.exist');
  // })
});

context('Dashboard (Overview)', () => {
  beforeEach(function () {
    // cy.intercept('/dashboard/overview*').as('overview')
    // cy.intercept('/notifications*').as('notifications')
    // cy.wait([
    //   '@overview',
    //   '@notifications',  
    // ])
    cy.fixture('dashboard/overview').then((data) => {
      this.overview = { statusCode: 200, body: { data: data.data }}
    })
  });

  it("should display the next generation dashboard overview", function () {
    cy.login()
    cy.visit('/dashboard')
    cy.wait('@me')

    cy.intercept('/dashboard/overview*', this.overview)

    cy.get('[data-test=filter-select]').should('be.visible')
    cy.get('[data-test=date-input-selector]').should('be.visible')

    cy.get('[data-test=view-public-profile-button]')
    .should('be.visible')
    .and('have.attr', 'href')
    .and('match', /contributor\/profile/) 

    cy.get('[data-test=view-repositories-button]')
    .should('be.visible')
    .and('have.attr', 'href')
    .and('match', /projects\/repositories/) 

    cy.get('[data-test=empty-chart]').should('not.exist')

  })

  it("should display the ranking data grid for active repository", function () {

  })

  it("should display the population growth chart for active repository", function () {

  })

  it("should display the number of merges/prs bar graph for active repository", function () {

  })

  it("should display the incremental repository eloc bar graph", function () {

  })  

});
