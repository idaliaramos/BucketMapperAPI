const DestinationController = require('../controllers/DestinationController');

module.exports = new DestinationController({
  destinationService: require('./destinationService'),
  userService: require('./userService')
});
