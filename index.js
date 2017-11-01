// const { JWT_KEY } = require('./env');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('express-jwt');
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

// const authenticationRouter = require('./lib/instances/authenticationRouter');
const usersRouter = require('./lib/instances/usersRouter');
const destinationsRouter = require('./lib/instances/destinationsRouter');
const adventuresRouter = require('./lib/instances/adventuresRouter');
//const adventtureTagsRouter = require('./lib/instances/adventureTagsRouter');
// server.use(authenticationRouter);
server.use(usersRouter);
server.use(destinationsRouter);
server.use(adventuresRouter);
// server.use(adventureTagsRouter);
server.all('*', (request, response, next) => response.sendStatus(404));

const port =
  process.env.PORT && /^\d+$/.test(process.env.PORT)
    ? parseInt(process.env.PORT)
    : 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
