const AdventureController = require('../controllers/AdventureController');

module.exports = new AdventureController({
  adventureService: require('./adventureService'),
  destinationService: require('./destinationService')
});
