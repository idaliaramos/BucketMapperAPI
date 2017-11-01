const EntityController = require('./EntityController');

class AdventureController extends EntityController {
  constructor({ adventureService, destinationService }) {
    super({
      entityName: 'Adventure',
      entityService: adventureService
    });
    this._destinationService = destinationService;
    this._bindMethods(['createForDestination', 'findByDestinationId']);
  }

  async findByDestinationId(request, response, next) {
    try {
      const { id: destinationId } = request.params;
      console.log(destinationId, 'this is the id');
      const adventures = await this._entityService.findByDestinationId(
        destinationId
      );

      response.json(adventures);
    } catch (error) {
      console.log(error);
    }
    // this._destinationService.findByUserId(userId);
  }
  async createForDestination(request, response, next) {
    try {
      const { id: destinationId } = request.params;
      let attributes = request.body;
      const newAdventure = await this._entityService.createForDestination(
        destinationId,
        attributes
      );
      response.json(newAdventure);
    } catch (error) {
      console.log(error);
    }
  }
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = AdventureController;
