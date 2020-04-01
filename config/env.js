const _ = require('lodash');
const chalk = require('chalk');

// WARNING - do not include any sensitive keys here
// best practice is to keep this all out of git, but since these are all
// published in the app anyway, we're not at any risk here

const configsByEnv = {
  // defaults are always applied, and then overridden depending on the environment
  default: {
    NODE_ENV: 'development',
    MY_ENV: 'development',
    API_TIMEOUT: 30000,

    CHROME_STORAGE_ENGINE: 'local', // can switch to 'sync' - see lib/storage-helpers
    EXTENSION_MESSAGE_ID: 'ethdevtools', // to identify messages from our extension - see lib/message-passing
    EXTENSION_ID: 'kalkibnckdbnmcficgcbjgfhpgpclboi',
  },
  development: {
  },
  test: {
    NODE_ENV: 'test',
    MY_ENV: 'test',
  },
  staging: {
    NODE_ENV: 'production',
    MY_ENV: 'staging',

  },
  production: {
    NODE_ENV: 'production',
    MY_ENV: 'production',
  },
};

const ENVIRONMENT_VARS = {
  ...configsByEnv.default,
  ...configsByEnv[process.env.LOAD_ENV || 'development']
};


// allow some config overrides while working on local dev
// loaded from a local.js file which is git ignored
if (ENVIRONMENT_VARS.NODE_ENV === 'development') {
  try {
    Object.assign(ENVIRONMENT_VARS, require('./local.js'));
  } catch (err) {
    // do nothing...
  }
}

console.log(chalk.blue('============ CURRENT CONFIG ============'));
console.log(ENVIRONMENT_VARS);
console.log(chalk.blue('========================================'));
Object.assign(process.env, ENVIRONMENT_VARS);

module.exports = {
  env: ENVIRONMENT_VARS,
  publicEnv: _.mapValues(ENVIRONMENT_VARS, (val) => JSON.stringify(val)),
};

