const EntityController = require('./EntityController');

class DestinationController extends EntityController {
  constructor({ destinationService, userService }) {
    super({
      entityName: 'Destination',
      entityService: destinationService
    });
    this._userService = userService;
    this._bindMethods(['findByUserId', 'createForUser']);
  }

  async findByUserId(request, response, next) {
    try {
      const { id: userId } = request.params;
      const user = await this._userService.getById(userId);
      const destinations = await this._entityService.findByUserId(
        user.id,
        request.authenticatedUserId
      );
      response.json(destinations);
    } catch (error) {
      response.sendStatus(401);
    }
    // this._destinationService.findByUserId(userId);
  }
  async createForUser(request, response, next) {
    try {
      // const { id: userId } = request.params;
      const userId = request.params.id;
      let attributes = request.body;
      const user = await this._userService.getById(userId);

      const newDestination = await this._entityService.createForUser(
        user.id,
        attributes,
        request.authenticatedUserId
      );
      // console.log(request.authenticatedUserId, user.id, userId);
      if (request.authenticatedUserId !== user.id) {
        response.sendStatus(401);
      }
      response.json(newDestination);
    } catch (error) {
      response.sendStatus(401);
    }
  }
  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }
}

module.exports = DestinationController;
