const DestinationService = require('../services/DestinationService');

const { DEBUG } = require('../../env');

module.exports = new DestinationService({
  destinationValidator: require('./destinationValidator'),
  destinationRepository: require('./destinationRepository'),
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
