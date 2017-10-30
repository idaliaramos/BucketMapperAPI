const DestinationService = require('../services/DestinationService');

const { DEBUG } = require('../../env');

module.exports = new DestinationService({
  userValidator: require('./destinationValidator'),
  userRepository: require('./destinationRepository'),
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
