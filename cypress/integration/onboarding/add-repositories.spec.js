/// <reference types='cypress' />

// Uncheck repositories needs to be a command since running it here will take no effect
Cypress.Commands.add("uncheckRepositories", () => {
  cy.get('[data-test=browse-repository-list_list] .Mui-checked input[type=checkbox]')
    .uncheck({force: true})
})

context('Add repositories', () => {
  beforeEach(function () {
    cy.intercept('GET', '/repos/github').as('reposGithub')
    cy.intercept('POST', '/user/setIsOnboarded').as('setIsOnboarded')
    cy.fixture('repositories-test-data').then((data) => {this.testRepositories = data})
    cy.fixture('example-repository-test-data').then((data) => {this.exampleRepositories = data})
    cy.fixture('external-repositories-test-data').then((data) => {this.externalRepositories = data})
    cy.login()
    cy.visit('/onboarding/select-repositories')
    cy.wait('@reposGithub')
  })

  it('skip button should set user as onboarded and redirect to secondary emails', () => {
    cy.contains('Skip')
      .should('be.visible')
      .and('be.enabled')
    cy.contains('Skip')
      .click()
    cy.wait('@setIsOnboarded').its('request.body').should('have.property', 'isOnboarded').and('eq', true)
    cy.url().should('contain', '/onboarding/secondary-emails')
  })

  it('sends external and browsed repositories to API when user clicks confirm ', function () {
    cy.contains(this.testRepositories['onboarding:single'])

    cy.uncheckRepositories()
    cy.intercept('POST', '/projects', 'success').as('postProjectsSuccess')
    cy.contains(this.testRepositories['onboarding:single'])
      .find('input')
      .check()
    cy.get('#OnboardingConfirmButton')
      .should('be.visible')
      .and('be.enabled')
    cy.get('#RepositoryURL')
      .type(this.testRepositories['onboarding:external'])
    cy.contains('button', 'Add URL')
      .should('be.enabled')
      .click()
    cy.get('#OnboardingConfirmButton')
      .click()
    cy.wait('@postProjectsSuccess')
      .its('request.body')
      .should('deep.equal', {
        projects: [
          {
            alreadyAdded: false,
            gitUrl: "git://github.com/rosa-merico-e2e/career_rush.git",
            language: null,
            lastUpdated: "2021-02-03T20:09:33Z",
            name: "career_rush",
            url: "https://api.github.com/repos/rosa-merico-e2e/career_rush"
          },
          {
            alreadyAdded: false,
            gitUrl: "https://github.com/merico-dev/example-repository.git",
            name:"example-repository",
            provider: "github",
            url: "https://api.github.com/repos/merico-dev/example-repository"
          },
          {
            alreadyAdded: false,
            gitUrl: "https://github.com/LucasKauz/LucasKauz.git",
            name: "LucasKauz",
            provider: "github",
            url: "https://api.github.com/repos/LucasKauz/LucasKauz"
          }
        ]
      })
  })

  it('show failures when repositories fails', function () {
    cy.uncheckRepositories()
    cy.intercept('POST', '/projects', {
        failures: [{
          project: { name: 'Failed project name' },
          message: 'What went wrong'
        }],
        successes: [],
        warnings: []
      }).as('postProjectsFailure')
    cy.get('[data-test=browse-repository-list_list] input[type=checkbox]')
    cy.contains(this.testRepositories['onboarding:single'])
      .find('input')
      .check()
    cy.get('#OnboardingConfirmButton')
      .should('be.visible')
      .and('be.enabled')
    cy.get('#RepositoryURL')
      .type(this.testRepositories['onboarding:external'])
    cy.contains('button', 'Add URL')
      .should('be.enabled')
      .click()
    cy.get('#OnboardingConfirmButton')
      .click()
      .wait('@postProjectsFailure')
    cy.contains('Adding repositories failed').should('be.visible')
    cy.contains('Failed project name').should('be.visible')
    cy.contains('What went wrong').should('be.visible')
    cy.contains('OK')
      .should('be.visible')
      .click()
    cy.contains('Adding repositories failed').should('not.exist')
  })

  it('search repositories by name', function () {
    cy.get('#RepositorySearch')
      .type(this.testRepositories['onboarding:single'])

    cy.get('[data-test=browse-repository-list_list] input[type=checkbox]')
      .should('have.length', 1)
  })

  it('can add external repositories', function () {
    cy.uncheckRepositories()

    cy.contains('Add by URL').within(() => {
      cy.get('span').trigger('mouseover')
    })
    cy.contains('Enter a valid public Git URL.')
    cy.wrap(this.externalRepositories.github).each(($repoURL) => {
      cy.get('#RepositoryURL')
        .type($repoURL)
      cy.contains('button', 'Add URL')
        .should('be.enabled')
        .click()

      cy.get('[data-test="external-repo-list-item"]').should(($repos) => {
        expect($repos).to.include.text($repoURL)
      })
    })
  })

  it('can remove staged external repositories', function () {
    cy.uncheckRepositories()
    cy.get('#RepositoryURL')
      .type(this.testRepositories['onboarding:external'])
    cy.contains('button', 'Add URL')
      .should('be.enabled')
      .click()
    
    cy.get('[data-test="external-repo-list-item"]').should('have.length', 2)
    cy.get('[class*="StyledTrash"]')
      .should('be.visible')
      .click()

    cy.get('[data-test="external-repo-list-item"]').should('have.length', 1)
  })

  it('cannot add the same repo', function () {
    cy.get('#RepositoryURL')
      .type(this.testRepositories['onboarding:external'])
    cy.contains('button', 'Add URL')
      .should('be.enabled')
      .click()
    cy.get('[data-test="external-repo-list-item"] span')
      .should('have.text', this.testRepositories['onboarding:external'])
    cy.get('#RepositoryURL')
      .type(this.testRepositories['onboarding:external'])
    
    cy.get('#RepositoryURL-helper-text')
      .should('have.text', 'Repository already added for processing.')
  })

  it.skip('can add 10 repositories', function () {
    cy.intercept('POST', '/projects', 'success').as('postProjectsSuccess')
    cy.contains('You may add a maximum of 10 repositories to process.')
    cy.contains('Browse Repositories').within(() => {
      cy.get('span').trigger('mouseover')
    })
    cy.contains('You can only add repositories under the username of your current account. We will support repositories in multiple usernames in the future.')
    cy.get('#RepositoryURL').type(this.externalRepositories.github[0])
    cy.contains('button', 'Add URL').should('be.enabled').click()
    cy.get('#OnboardingConfirmButton').click()
    
    cy.wait('@postProjectsSuccess')
      .its('request.body.projects.length')
      .should('eq', 10)
  })

  it.skip('cannot add more than 10 repositories', function () {
    cy.wrap(this.externalRepositories.github).then(($repoURL) => {
      cy.get('#RepositoryURL')
        .type($repoURL[0])
      cy.contains('button', 'Add URL')
        .should('be.enabled')
        .click()
      cy.get('#RepositoryURL')
        .type($repoURL[1])

      cy.get('#RepositoryURL-helper-text')
        .should('contain', 'Max repositories added.')
    })
  })

  context('when onboarding with github account', () => {
    it('automatically includes github example repository', function () {
      cy.get('[data-test="external-repo-list-item"]').within(() => {
        cy.contains(this.exampleRepositories.github.url)
  
        cy.contains('*An example repository will be automatically added to your account for demo purposes. You can remove it later.')
      })
    })

    it('cannot add external gitlab repository', function () {
      cy.get('#RepositoryURL')
        .type(this.exampleRepositories.gitlab.url)

      cy.get('#RepositoryURL-helper-text')
        .should('have.text', 'Service Provider does not match your account (github).')
    })
  })
})
