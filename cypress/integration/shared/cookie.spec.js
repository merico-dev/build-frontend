/// <reference types="cypress" />

context('Cookies', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it("shows cookie warning while user didn't accept", () => {
    cy.get('[data-test="cookie-accept"]').should('exist');
  })

  it('hides cookie warning when accepted', () => {
    cy.get('[data-test="cookie-accept"]').click();
    cy.reload();
    cy.get('[data-test="cookie-accept"]').should('not.exist');
  })

})
