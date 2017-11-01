const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');
const { pick, omit } = require('../utils/ObjectUtils');

class DestinationService {
  constructor({
    // destinationValidator,
    destinationRepository,
    userRepository,
    logError
  }) {
    // this._destinationValidator = destinationValidator;
    this._destinationRepository = destinationRepository;
    this._userRepository = userRepository;
    // this._logError = isFunction(logError) ? logError : noop;
  }
  // async _getAuthenticatedUser(authentication) {
  //   const { userId: authenticatedUserId } = authentication;
  //   if (!Number.isFinite(authenticatedUserId)) return null;
  //   return await this._userRepository.getUserById(authenticatedUserId);
  // }

  async create(
    attributes
    // authentication
  ) {
    try {
      // console.log(attributes, 'THIS IS THE body');
      return await this._destinationRepository.create(attributes);
    } catch (error) {
      console.log(error);
    }
  }

  async createForUser(id, attributes) {
    // console.log(id, attributes, 'this is the attributes in the d service');
    return await this._destinationRepository.createForUser(id, attributes);
  }

  async delete(id) {
    return await this._destinationRepository.delete(id);
  }

  async findByUserId(userId) {
    return await this._destinationRepository.findByAttribute('userId', userId);
  }

  async getById(destinationId) {
    console.log(destinationId, 'inthe destination Service');
    return await this._destinationRepository.findByAttribute(
      'destinationId',
      destinationId
    );
  }
  async update(id, attributes) {
    try {
      const destination = await this._destinationRepository.update(
        id,
        attributes
      );
      if (!destination) throw this._createNotFoundError();
      return await this._destinationRepository.update(id, attributes);
    } catch (error) {
      // this._logError(error);
    }
  }
}

module.exports = DestinationService;
