const { promisify } = require('util');
const JwtUtils = require('jsonwebtoken');
const signJwt = promisify(JwtUtils.sign);
const bcrypt = require('bcryptjs');
const { isFunction } = require('../utils/LangUtils');
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

  async authenticate(userInfo) {
    console.log(userInfo, 'the user info in authentication service');
    try {
      userInfo = Object.assign({}, userInfo);
      if (!userInfo.email || !userInfo.password) {
        throw this._createNotFoundError();
      }
      userInfo = await this._authenticationValidator.validate(userInfo);
      console.log(userInfo.email, 'this is the email');
      const [user] = await this._userRepository.findByAttribute(
        'email',
        userInfo.email
      );

      if (!user) {
        throw this._createInvalidInputError();
      }

      const isValidPassword = await bcrypt.compare(
        userInfo.password,
        user.hashedPassword.trim()
      );

      if (!isValidPassword) {
        throw this._createInvalidInputError();
      }

      const timeIssued = Math.floor(Date.now() / 1000);
      const timeExpires = timeIssued + 86400; // 1 day

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
    }
  }
  _createInvalidInputError() {
    return new Error(AuthenticationService.ERROR_INVALID_INPUT);
  }
}
//michael
//nestor
AuthenticationService.ERROR_INVALID_INPUT =
  'AuthenticationService.ERROR_INVALID_INPUT';
module.exports = AuthenticationService;
