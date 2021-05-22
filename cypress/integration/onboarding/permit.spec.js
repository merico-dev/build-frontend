/// <reference types="cypress" />

context('Dashboard: Permit', () => {
  beforeEach(() => {
    cy.visit('/onboarding/github');
  })

  it("has a confirm button", () => {
    cy.get('#OnboardingConfirmButton').should('be.visible');
  })
  
  it("has the terms text warning linking to the terms page", () => {
    cy.contains('Terms and Conditions').should('be.visible')
    cy
      .contains('Terms and Conditions')
      .should('have.attr', 'href')
      .and('eq', '/terms')
  })
})
