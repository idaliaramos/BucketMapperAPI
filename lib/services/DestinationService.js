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
    // this._logError = isFunction(logError) ? logError : noop;
  }
  async _getAuthenticatedUser(authentication) {
    const { userId: authenticatedUserId } = authentication;
    if (!Number.isFinite(authenticatedUserId)) return null;
    return await this._userRepository.getUserById(authenticatedUserId);
  }

  async create(attributes, authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      attributes = await this._destinationValidator.validate(
        attributes,
        'forCreate'
      );
      attributes.authorId = authenticatedUser.id;
      return await this._destinationRepository.create(attributes);
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(destinationService.name)) throw error;
      if (error.message.endsWith('Validator.ERROR_INVALID_INPUT')) {
        throw this._createInvalidInputError();
      }
      throw this._createUnexpectedError();
    }
  }
}

module.exports = DestinationService;
