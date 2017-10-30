const EntityController = require('../controllers/EntityController');

module.exports = new EntityController({
  entityName: 'Destination',
  entityService: require('./destinationService')
});
