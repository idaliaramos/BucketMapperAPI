const { promisify } = require('util');
const JwtUtils = require('jsonwebtoken');
const signJwt = promisify(JwtUtils.sign);
const bcrypt = require('bcryptjs');

const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');

class AuthenticationService {
  constructor({
    authenticationValidator,
    jwtSecretKey,
    userRepository,
    logError
  }) {
    this._authenticationValidator = authenticationValidator;
    this._userRepository = userRepository;
    this._jwtSecretKey = jwtSecretKey;
    this._logError = isFunction(logError) ? logError : noop;
  }

  async authenticate(credentials) {
    try {
      credentials = Object.assign({}, credentials);
      if (!credentials.username || !credentials.password) {
        throw this._createInvalidInputError();
      }
      credentials = await this._authenticationValidator.validate(credentials);
      const [user] = await this._userRepository.findByAttribute(
        'username',
        credentials.username
      );
      if (!user) throw this._createInvalidCredentialsError();
      const isValidPassword = await bcrypt.compare(
        credentials.password,
        user.hashedPassword
      );
      if (!isValidPassword) throw this._createInvalidCredentialsError();
      const timeIssued = Math.floor(Date.now() / 1000);
      const timeExpires = timeIssued + 86400 * 14; // 14 days
      return signJwt(
        {
          iss: 'bucketMapper',
          aud: 'bucketMapper',
          iat: timeIssued,
          exp: timeExpires,
          sub: user.id
        },
        this._jwtSecretKey
      );
    } catch (error) {
      this._logError(error);
      if (error.message.startsWith(AuthenticationService.name)) throw error;
      throw this._createUnexpectedError();
    }
  }

  _createUnexpectedError() {
    return new Error(AuthenticationService.ERROR_UNEXPECTED);
  }

  _createInvalidInputError() {
    return new Error(AuthenticationService.ERROR_INVALID_INPUT);
  }

  _createInvalidCredentialsError() {
    return new Error(AuthenticationService.ERROR_CREDENTIALS_INVALID);
  }
}

AuthenticationService.ERROR_UNEXPECTED =
  'AuthenticationService.ERROR_UNEXPECTED';
AuthenticationService.ERROR_INVALID_INPUT =
  'AuthenticationService.ERROR_INVALID_INPUT';
AuthenticationService.ERROR_CREDENTIALS_INVALID =
  'AuthenticationService.ERROR_CREDENTIALS_INVALID';

module.exports = AuthenticationService;
