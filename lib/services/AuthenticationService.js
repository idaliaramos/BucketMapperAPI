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
        return Boom.badRequest('invalid query1');
      }
      userInfo = await this._authenticationValidator.validate(userInfo);
      const [user] = await this._userRepository.findByAttribute(
        'email',
        userInfo.email
      );

      if (!user) {
        return Boom.badRequest('invalid query');
      }
      else{
        const isValidPassword = await bcrypt.compare(
          userInfo.password,
          user.hashedPassword.trim()
        );

        if (!isValidPassword) {
          return Boom.badRequest('invalid email or password');
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
      }

    } catch (error) {
      return Boom.badRequest('Invalid email or password')
    }
  }
}
//michael
//nestor
module.exports = AuthenticationService;
