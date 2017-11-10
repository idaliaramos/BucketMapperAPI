const { promisify } = require('util');
const JwtUtils = require('jsonwebtoken');
const signJwt = promisify(JwtUtils.sign);
const bcrypt = require('bcryptjs');

class AuthenticationService {
  constructor({ authenticationValidator, jwtSecretKey, userRepository }) {
    this._authenticationValidator = authenticationValidator;
    this._userRepository = userRepository;
    this._jwtSecretKey = jwtSecretKey;
  }

  async authenticate(userInfo) {
    console.log(userInfo, 'the user info in authentication service');
    try {
      userInfo = Object.assign({}, userInfo);
      if (!userInfo.email || !userInfo.password) {
        console.log('invalid user info');
        return;
      }
      userInfo = await this._authenticationValidator.validate(userInfo);

      const [user] = await this._userRepository.findByAttribute(
        'email',
        userInfo.email
      );
      console.log(user, 'this is the user, service');
      if (!user) {
        console.log('invalid user');
        return;
      }

      console.log(
        typeof userInfo.password === 'string',
        'this is the password plain'
      );
      const isValidPassword = await bcrypt.compare(
        userInfo.password,
        user.hashedPassword.trim()
      );
      console.log(isValidPassword, 'is this true?');
      console.log('plain password', userInfo.password);
      if (!isValidPassword) {
        console.log('invalid password', isValidPassword);
        return;
      }
      console.log('past this <<<<<<<<<');
      const timeIssued = Math.floor(Date.now() / 1000);
      const timeExpires = timeIssued + 86400; // 1 day
      console.log(this._jwtSecretKey, 'this is the key');
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
    }
  }
}
module.exports = AuthenticationService;
