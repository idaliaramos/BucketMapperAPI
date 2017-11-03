const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');
const { pick, omit } = require('../utils/ObjectUtils');

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
    const authenticatedUserId = authentication.userId;
    console.log(
      authenticatedUserId,
      'thi is the authentication in the des service'
    );
    if (!Number.isFinite(authenticatedUserId)) return null;
    return await this._userRepository.getById(authenticatedUserId);
  }

  async create(attributes, authentication) {
    console.log(authentication, 'this is the authentication in the create');
    try {
      // console.log(attributes, 'THIS IS THE body');
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      return await this._destinationRepository.create(attributes);
    } catch (error) {
      console.log(error);
    }
  }

  async createForUser(id, attributes, authentication) {
    console.log(
      id,
      attributes,
      authentication,
      'this is the attributes in the DESTINATION service'
    );
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
      throw this._createUnexpectedError();
    }
  }

  async delete(id, authentication) {
    return await this._destinationRepository.delete(id);
  }

  async findByUserId(userId, authenthication) {
    const authenticatedUser = await this._getAuthenticatedUser(authentication);
    if (!authenticatedUser) throw this._createPermissionDeniedError();
    console.log(userId, 'in the destination Service, TODAY');
    return await this._destinationRepository.findByAttribute('userId', userId);
  }

  async getById(destinationId, authentication) {
    console.log(destinationId, 'inthe destination Service');
    return await this._destinationRepository.getById(destinationId);
  }
  async update(id, attributes, authentication) {
    try {
      const destination = await this._destinationRepository.update(
        id,
        attributes
      );
      if (!destination) throw this._createNotFoundError();
      return await this._destinationRepository.update(id, attributes);
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
