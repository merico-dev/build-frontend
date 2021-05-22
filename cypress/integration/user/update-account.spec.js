context('Update Account / Profile', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/account/settings')
  })

  it('allows user to save profile', () => {
    cy.get('button').contains('Save').should('exist')
  })

  it('displays the user profile fields', () => {
    cy.get('input#email[type="text"]').should('exist').should('be.disabled')
    cy.get('input#name[type="text"]').should('exist').should('not.be.disabled')
    cy.get('input#website[type="text"]').should('exist').should('not.be.disabled')
  })

})