module.exports = {
  apiUrl: 'http://localhost:1337',
  frontendUrl: 'http://localhost:3000',
  mixpanel: {
    enabled: false, // Disabled by Default, ENABLE if working on MP Analytics
    apiKey: '***' // Replace with your Developer MP API Key
  },
  developer: {
    noRedirectOnAuthFail: true
  }
};
