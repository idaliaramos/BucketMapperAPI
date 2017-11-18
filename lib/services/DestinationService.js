const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');
const { pick, omit } = require('../utils/ObjectUtils');
const Boom = require('boom');
class DestinationService {
  constructor({
    destinationValidator,
    destinationRepository,
    userRepository,
    logError
  }) {
    this._destinationValidator = destinationValidator;
    this._destinationRepository = destinationRepository;
    this._userRepository = userRepository;
    this._logError = isFunction(logError) ? logError : noop;
  }
  async _getAuthenticatedUser(authentication) {
    // const { userId: authenticatedUserId } = authentication;
    //authentication is undefined ,, again..

    // const authenticatedUserId = authentication.userId;
    const authenticatedUserId = authentication;

    if (!Number.isFinite(authenticatedUserId)) return null;
    return await this._userRepository.getById(authenticatedUserId);
  }

  async create(attributes, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );

      return await this._destinationRepository.create(attributes);
    } catch (error) {
      this._logError(error);
    }
  }

  async createForUser(id, attributes, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (authenticatedUser.id !== id) {
        throw this._createPermissionDeniedError();
      }
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      return await this._destinationRepository.createForUser(id, attributes);
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(DestinationService.name)) throw error;

      //check
    }
  }

  async delete(destinationId, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication.userId
      );
      const record = await this._destinationRepository.getRecord(destinationId);
      if (!authenticatedUser) {
        throw this._createPermissionDeniedError();
      }

      if (authenticatedUser.id !== record.userId) {
        throw this._createPermissionDeniedError();
      }

      return await this._destinationRepository.delete(destinationId);
    } catch (error) {
      this._logError(error);
    }
  }

  async findByUserId(userId, authentication) {
    const authenticatedUser = await this._getAuthenticatedUser(authentication);
    if (!authenticatedUser) throw this._createPermissionDeniedError();
    // if (authenticatedUser.id != userId) {
    //   throw Boom.unauthorized('invalid request');
    // }
    return await this._destinationRepository.findByAttribute('userId', userId);
  }

  async getById(destinationId, authenticatedUserId, response) {
    try {
      let destination = await this._destinationRepository.getById(
        destinationId
      );
      if (destination.userId !== authenticatedUserId) {
        return response.sendStatus(401);
      }
      return destination;
    } catch (error) {
      return Boom.badRequest('bad request');
      //goback undo unauthorized
    }
  }
  async update(destinationId, attributes, authentication) {
    try {
      let authenticatedUser = await this._getAuthenticatedUser(authentication);

      // TODO:knex call to destination to retrieve dr, which include user id fk
      //wrote new function but might need to refactor to dry
      const record = await this._destinationRepository.getRecord(destinationId);
      //fix
      //check
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      const destination = await this._destinationRepository.update(
        destinationId,
        attributes
      );
      if (!destination) throw this._createNotFoundError();
      return await this._destinationRepository.update(
        destinationId,
        attributes
      );
    } catch (error) {
      this._logError(error);
    }
  }
  _createUnexpectedError() {
    return new Error(DestinationService.ERROR_UNEXPECTED);
  }

  _createPermissionDeniedError() {
    return new Error(DestinationService.ERROR_PERMISSION_DENIED);
  }

  _createInvalidInputError() {
    return new Error(DestinationService.ERROR_INVALID_INPUT);
  }

  _createNotFoundError() {
    return new Error(DestinationService.ERROR_NOT_FOUND);
  }
}
DestinationService.ERROR_UNEXPECTED = 'DestinationService.ERROR_UNEXPECTED';
DestinationService.ERROR_NOT_FOUND = 'DestinationService.ERROR_NOT_FOUND';
DestinationService.ERROR_PERMISSION_DENIED =
  'DestinationService.ERROR_PERMISSION_DENIED';
DestinationService.ERROR_INVALID_INPUT =
  'DestinationService.ERROR_INVALID_INPUT';
module.exports = DestinationService;
