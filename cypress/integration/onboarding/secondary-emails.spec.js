/// <reference types='cypress' />

context('Dashboard: Secondary Emails', () => {
  beforeEach(function () {
    cy.intercept('POST', '/account').as('saveAccount');
    cy.fixture('user-emails-test-data').then((data) => {this.testRepositories = data})
    cy.login();
    cy.visit('/onboarding/secondary-emails');
    cy.contains('Start Processing').as('startProcessing')
    cy.get('@startProcessing').parents('form').as('emailsForm')
  });

  it('skip button should redirect to dashboard', () => {
    cy.contains('Skip')
      .should('be.visible')
      .and('be.enabled');
    cy.contains('Skip')
      .click();
    cy.url().should('contain', '/dashboard');
  });

  it('redirects to dashboard saving account if the emails were modified', () => {
    cy.get('@startProcessing')
      .and('be.enabled');
    cy.get('input[placeholder="Secondary email address"]:enabled')
      .first()
      .type('no-reply@merico.build')
    cy.get('@startProcessing')
      .click();
    cy.wait('@saveAccount')
    cy.url().should('contain', '/dashboard');
    cy.visit('/account');
    cy.wait('@me')
    cy.contains('no-reply@merico.build').should('exist')
  })

  it('block emails with the wrong format', () => {
    // more tests should be done on unit level
    cy.get('input[placeholder="Secondary email address"]:enabled')
      .first()
      .type('onlytext');
    cy.get('@startProcessing').click();
    cy.get('@emailsForm').should(($form) => {
      expect($form.get(0).checkValidity()).to.equal(false);
    });
  })
});
