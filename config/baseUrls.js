module.exports = {
  localhost: {
    backendUrl: 'http://localhost:1337',
    frontendBaseUrl: 'http://localhost:3000'
  },
  sandbox: {
    backendUrl: 'https://sandbox-backend.mericobuild.com',
    frontendBaseUrl: 'https://sandbox.merico.build'
  },
  staging: {
    backendUrl: 'https://staging-backend.mericobuild.com',
    frontendBaseUrl: 'https://staging.merico.build'    
  },
  candidate: {
    backendUrl: 'https://candidate-backend.mericobuild.com',
    frontendBaseUrl: 'https://candidate.merico.build'
  },
  production: {
    backendUrl: 'https://backend.mericobuild.com',
    frontendBaseUrl: 'https://merico.build'
  }
}
