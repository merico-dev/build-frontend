/* eslint-disable global-require */
/* eslint-disable no-console */
let local;
try {
  local = require('./local');
} catch (error) {
  console.info('INFO: No local.js config file found', error);
}

const loadConfigFile = (filePath) => {
  try {
    return require(filePath)
  } catch (e) {
    console.info(`resolveConfig:loadConfigFile: Could not load ${filePath} error=${e}`)
  }
}

let config = local;
const env = process.env.BUILD_ENV;

if (env === 'staging') {
  config = loadConfigFile('./staging.js')
} else if (env === 'production2') {
  config = loadConfigFile('./production2.js')
} else if (env === 'production') {
  config = loadConfigFile('./production1.js')
} else if (env === 'sandbox') {
  config = loadConfigFile('./sandbox.js')
} else if (env === 'e2e') {
  config = loadConfigFile('./e2e.js')
}

module.exports = config;
