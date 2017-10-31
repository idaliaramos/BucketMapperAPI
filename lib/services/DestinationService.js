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
  async getAll() {
    try {
      // console.log('in the service');
      const destinations = await this._destinationRepository.getAll();
      // console.log('in the service>>>>>>>>>>', destinations);
      return destinations;
    } catch (error) {
      console.log(error);
    }
  }
  async createForUser(id, attributes) {
    console.log(id, attributes, 'this is the attributes in the d service');
    return await this._destinationRepository.createForUser(id, attributes);
  }

  async delete(id) {
    return await this._destinationRepository.delete(id);
  }

  async findByUserId(userId) {
    return await this._destinationRepository.findByAttribute('userId', userId);
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

  //   async update(id, attributes, authentication) {
  //   try {
  //     const article = await this._articleRepository.getById(id);
  //     if (!article) throw this._createNotFoundError();
  //     return await this._articleRepository.update(id, attributes);
  //   } catch (error) {
  //     this._logError(error);
  //     if (error.message.startsWith(ArticleService.name)) throw error;
  //     if (error.message.endsWith('Validator.ERROR_INVALID_INPUT')) {
  //       throw this._createInvalidInputError();
  //     }
  //     throw this._createUnexpectedError();
  //   }
  // }
}

module.exports = DestinationService;
