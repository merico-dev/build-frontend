context('Project Public Profile (PPP) - Signed In User', () => {
  beforeEach(function () {
    cy.login()
    cy.fixture('projects/public-profile').then((response) => {
      this.publicProfile = { statusCode: 200, body: { data: response.data }}
    })
    cy.fixture('projects/public-profiles/search').then((response) => {
      this.publicProfileSearch = { statusCode: 200, body: { data: response.data }}
    })
    // NOTE: this gitUrl *MUST* match a project in the current E2E DB...
    cy.visit('/projects/repository/overview?gitUrl=git://github.com/rosa-merico-e2e/how-to-console-things.git')
  })

  it('displays the public project profile page (ppp)', function () {
    cy.get('h1').contains('Project Profile').should('be.visible')
    // assert learn more button exists
    // assert top contributors data-grid/wrapper exists
    // assert population graph exists
    // assert incremental eloc graph exists
    // assert numer of merges graph exists
  })

  it('shows project project owner and repository', function () {
    cy.intercept('/projects/public-profile?*', this.publicProfile)
    cy.intercept('/projects/public-profiles/search?*', this.publicProfileSearch)    
    const projectUrl = this.publicProfile.body.data.webUrl
    const ownerUrl = projectUrl.replace(`/${this.publicProfile.body.data.name}`, '')
    cy.get('[data-test=repository-owner-link]').should('be.visible')
    .and('have.attr', 'href', ownerUrl)
    cy.get('[data-test=repository-name-link]').should('be.visible')
    .and('have.attr', 'href', projectUrl)
  })

  it('search: shows project profile search form', function () {
    cy.get('[data-test=repository-search-form]').should('be.visible')
    cy.get('[data-test=search-projects-input]').should('be.visible')
    cy.get('[data-test=search-projects-button]').should('be.visible')
  })

  it('allows logged-in user to send invitations (to non-registered contributors)', function () {
    cy.get('[data-test=ranking-contributor-invite-trigger]').should('be.visible')
  })

  it.skip('search: allows only valid git project urls to be searched', function () {
    // type a valid git:// or http:// or https:// url into input
    // assert that search button is NOT disabled
    // click search button
    // (intercept search response --- should be done already in beforeEach)
    // asssert that search success message exists (data-test=search-result-success-message)
    // assert that 'View Profile' button is visible and exists (data-test=search-results-repository-view-button)
    // assert that 'View Profile' button links to repository url
  })

  it.skip('search: prevents invalid urls from being searched', function () {
    // type a bad/malformed/invalid git url int search input
    // assert that search button IS disabled
  })
})

context('Project Public Profile (PPP) - Signed OUT User', () => {
  beforeEach(function () {
    // DO NOT call cy.login()!, we want an unauthorized state...
    cy.fixture('projects/public-profile').then((response) => {
      this.publicProfile = { statusCode: 200, body: { data: response.data }}
    })
    // NOTE: this gitUrl *MUST* match a project in the current E2E DB...
    cy.visit('/projects/repository/overview?gitUrl=git://github.com/rosa-merico-e2e/how-to-console-things.git')
    cy.intercept('/projects/public-profile?*', this.publicProfile)
  })

  it('allows public (non-auth) access to project profile', function () {
    cy.get('h1').contains('Project Profile').should('be.visible')
    // cy.visit('/projects/repository/overview?gitUrl=git://github.com/e2corporation/java-analysis-tester-2.git')
    // assert that page is accessible for non-authenticated users
  })

  it('does not allow non-authorized (logged-in) users to send invitations', function () {
    cy.get('[data-test=ranking-contributor-invite-trigger]').should('not.exist')
  })
})