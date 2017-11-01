const EntityController = require('./EntityController');

class AdventureController extends EntityController {
  constructor({ adventureService, destinationService }) {
    super({
      entityName: 'Adventure',
      entityService: adventureService
    });
    this._destinationService = destinationService;
    this._bindMethods(['createForDestination']);
  }

  // async findByDestinationId(request, response, next) {
  //   try {
  //     //get destination Id
  //   } catch (error) {
  //     // console.log(error);
  //   }
  //   // this._destinationService.findByUserId(userId);
  // }
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
