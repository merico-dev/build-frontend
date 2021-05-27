/// <reference types="cypress" />

context('Sign out', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/account/signed-out')
    cy.wait('@me');
  });

  it("removes the jwt token from cookies", () => {
    cy.getCookie('ce-backend-jwt').should('not.exist');
  });

  it("removes user menu when logged out", () => {
    cy.get('button[aria-label="Toggle user menu"]').should('not.exist');
  });

  it("shows a go back home button", () => {
    cy.get('button').contains('Go back to Home').should('exist');
  });
})
