/// <reference types="cypress" />

context('Header - Signed in', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('/me').as('me');
    cy.visit('/account');
    cy.wait('@me');
  });

  it("shows user menu only when the user clicks on avatar", () => {
    cy.contains('a', 'Sign Out').should('not.exist');
    cy.get('button[aria-label="Toggle user menu"]').click();
    cy.contains('a', 'Sign Out').should('exist');
  });

  it("redirect user to logout when clicking on logout", () => {
    cy.get('button[aria-label="Toggle user menu"]').click();
    cy.contains('a', 'Sign Out').click();
    cy.url().should('include', '/signed-out');
  });
});

