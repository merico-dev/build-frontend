/* eslint-disable global-require */
/* eslint-disable no-console */
let local;
try {
  local = require('./local');
} catch (error) {
  console.info('INFO: No local.js config file found', error);
}
const staging = require('./staging');
const production = require('./production1');
const production2 = require('./production2');
const sandbox = require('./sandbox');
const e2e = require('./e2e');

let config = local;
const env = process.env.BUILD_ENV;

if (env === 'staging') {
  config = staging;
} else if (env === 'production2') {
  config = production2;
} else if (env === 'production') {
  config = production;
} else if (env === 'sandbox') {
  config = sandbox;
} else if (env === 'e2e') {
  config = e2e;
}
module.exports = config;
