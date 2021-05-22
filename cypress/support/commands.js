// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// process.env.BUILD_ENV = Cypress.env('ENV')

// TODO: this is a hack to get cypress to read env
process.env.BUILD_ENV = Cypress.env('ENV')
const config = require('../../config/resolveConfig')

Cypress.Commands.add("login", () => {
  // TODO move this to fixture
  const userEmail = 'MericoE2E@merico.gonze.com';
  cy.request(`${config.apiUrl}/auth/github/e2e/getTokenByEmail?email=${userEmail}`)
    .then((response) => {
      cy.setCookie('ce-backend-jwt', response.body.token);
      cy.intercept('/me').as('me');
    });
})
