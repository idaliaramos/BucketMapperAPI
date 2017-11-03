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
      console.log(user, 'in controller user TODAY');
      const destinations = await this._entityService.findByUserId(user.id);
      response.json(destinations);
    } catch (error) {
      console.log(error);
    }
    // this._destinationService.findByUserId(userId);
  }
  async createForUser(request, response, next) {
    try {
      // const { id: userId } = request.params;
      const userId = request.params.id;
      let attributes = request.body;
      const user = await this._userService.getById(userId);
      console.log(user, 'this is the user');
      const newDestination = await this._entityService.createForUser(
        user.id,
        attributes,
        {
          userId: request.authenticatedUserId
        }
      );
      response.json(newDestination);
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

module.exports = DestinationController;
