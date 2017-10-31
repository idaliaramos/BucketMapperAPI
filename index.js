// const { JWT_KEY } = require('./env');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('express-jwt');
// const nodemon = require('nodemon');
// const UnauthorizedError = require('express-jwt/lib/errors/UnauthorizedError');
const Boom = require('boom');

const server = express();

server.use(bodyParser.json());
server.use(morgan('dev'));
server.use(cors()); // TODO: lock this down further, currently allows ALL requests
// function writeTextFile(filepath, output) {
//   var txtFile = new File(filepath);
//   txtFile.open('w'); //
//   txtFile.writeln(output);
//   txtFile.close();
// }
// server.use(
//   jwt({
//     secret: JWT_KEY,
//     requestProperty: 'jwt.payload',
//     credentialsRequired: false,
//     audience: 'bucketMapper',
//     issuer: 'bucketMapper'
//   })
// );
// server.use((request, response, next) => {
//   const authenticatedUserId = request.jwt ? request.jwt.payload.sub : undefined;
//   request.authenticatedUserId =
//     Number.isFinite(authenticatedUserId) && authenticatedUserId > 0
//       ? authenticatedUserId
//       : null;
//   next();
// });

// const authenticationRouter = require('./lib/instances/authenticationRouter');
const usersRouter = require('./lib/instances/usersRouter');
const destinationsRouter = require('./lib/instances/destinationsRouter');
// const adventuresRouter = require('./lib/instances/adventuresRouter');
//const adventtureTagsRouter = require('./lib/instances/adventureTagsRouter');
// server.use(authenticationRouter);
server.use(usersRouter);
server.use(destinationsRouter);
// server.use(adventuresRouter);
// server.use(adventureTagsRouter);
server.all('*', (request, response, next) => response.sendStatus(404));

server.use((error, request, response, next) => {
  console.error(error); // eslint-disable-line no-console
  if (
    error instanceof UnauthorizedError ||
    error.typeof === Boom.unauthorized
  ) {
    error = Boom.unauthorized(error.message, ['Bearer']);
  }
  if (!error.isBoom) error = Boom.badImplementation();
  response
    .set(error.output.headers)
    .status(error.output.statusCode)
    .json(error.output.payload);
});

const port =
  process.env.PORT && /^\d+$/.test(process.env.PORT)
    ? parseInt(process.env.PORT)
    : 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
