const bcrypt = require('bcryptjs');

const { omit, pick } = require('../utils/ObjectUtils');
const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');

class UserService {
  constructor({
    // userValidator,
    userRepository,
    logError
  }) {
    // this._userValidator = userValidator;
    this._userRepository = userRepository;
    // this._logError = isFunction(logError) ? logError : noop;
  }

  async create(attributes) {
    try {
      attributes = Object.assign({}, attributes);
      // attributes = await this._userValidator.validate(attributes, 'forCreate');
      const hashedPassword = await bcrypt.hash(attributes.password, 10);
      delete attributes.password;
      attributes.hashedPassword = hashedPassword;
      const user = await this._userRepository.create(attributes);
      return omit(user, 'hashedPassword');
    } catch (error) {
      // this._logError(error);
      // if (error.message.endsWith('Validator.ERROR_INVALID_INPUT')) {
      //   throw this._createInvalidInputError();
      // }
      // throw this._createUnexpectedError();
    }
  }
  async getById(id) {
    try {
      const user = await this._userRepository.getById(id);
      // delete attributes.password;
      // console.log(user, 'in service user');
      return pick(user, ['id', 'name', 'email']);
    } catch (error) {
      console.log(error);
    }
  }
  async getAll(authentication) {
    try {
      const authenticatedUser = await this._getAuthenticatedUser(
        authentication
      );
      if (!authenticatedUser) throw this._createPermissionDeniedError();
      // if (authenticatedUser.role !== 'ROLE_ADMIN') return [authenticatedUser];
      const users = await this._userRepository.getAll();
      return users.map(user => omit(user, 'hashedPassword'));
    } catch (error) {
      // this._logError(error);
      if (error.message.startsWith(UserService.name)) throw error;
      // throw this._createUnexpectedError();
    }
  }

  async _getAuthenticatedUser(authentication) {
    const { userId: authenticatedUserId } = authentication;
    if (!Number.isFinite(authenticatedUserId)) return null;
    const authenticatedUser = await this._userRepository.getById(
      authenticatedUserId
    );
    return omit(authenticatedUser, 'hashedPassword');
  }
}
// _createUnexpectedError() {
//   return new Error(UserService.ERROR_UNEXPECTED);
// }
//
// _createPermissionDeniedError() {
//   return new Error(UserService.ERROR_PERMISSION_DENIED);
// }
//
// _createInvalidInputError() {
//   return new Error(UserService.ERROR_INVALID_INPUT);
// }
//
// _createNotFoundError() {
//   return new Error(UserService.ERROR_NOT_FOUND);
// }
module.exports = UserService;
