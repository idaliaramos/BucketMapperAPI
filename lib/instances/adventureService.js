const AdventureService = require('../services/AdventureService');

const { DEBUG } = require('../../env');

module.exports = new AdventureService({
  adventureValidator: require('./adventureValidator'),
  adventureRepository: require('./adventureRepository'),
  destinationRepository: require('./destinationRepository'),
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
