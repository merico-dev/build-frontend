/// <reference types="cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  it('shows log in with github button', () => {
    cy.contains('a', 'Log in with GitHub')
  })
  it('login with github has the correct href', () => {
    cy.contains('a', 'Log in with GitHub')
      .should('have.attr', 'href')
      .and('include', '/auth/github')
  })
  it('shows log in with gitlab button', () => {
    cy.contains('a', 'Log in with GitLab')
  })
  it('login with gitlab has the correct href', () => {
    cy.contains('a', 'Log in with GitLab')
      .should('have.attr', 'href')
      .and('include', '/auth/gitlab')
  })
})
