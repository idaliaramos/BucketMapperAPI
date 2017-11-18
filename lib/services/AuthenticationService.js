const { promisify } = require('util');
const JwtUtils = require('jsonwebtoken');
const signJwt = promisify(JwtUtils.sign);
const bcrypt = require('bcryptjs');
const Boom = require('boom');
class AuthenticationService {
  constructor({ authenticationValidator, jwtSecretKey, userRepository }) {
    this._authenticationValidator = authenticationValidator;
    this._userRepository = userRepository;
    this._jwtSecretKey = jwtSecretKey;
  }

  async authenticate(userInfo) {
    try {
      userInfo = Object.assign({}, userInfo);
      if (!userInfo.email || !userInfo.password) {
        throw Boom.badRequest('invalid query');
      }
      userInfo = await this._authenticationValidator.validate(userInfo);

      const [user] = await this._userRepository.findByAttribute(
        'email',
        userInfo.email
      );

      if (!user) {
        throw Boom.badRequest('no such user');
      }

      const isValidPassword = await bcrypt.compare(
        userInfo.password,
        user.hashedPassword.trim()
      );

      if (!isValidPassword) {
        return Boom.badRequest('invalid password');
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
      console.log(error);
      throw error;
    }
  }
}
//michael
//nestor
module.exports = AuthenticationService;
