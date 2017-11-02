const express = require('express');
const Boom = require('boom');
const router = express.Router();

const adventureController = require('./adventureController');
//finished post
router.post(
  '/destinations/:id/adventures',
  adventureController.createForDestination
);
//finished get by destination
router.get(
  '/destinations/:id/adventures',
  adventureController.findByDestinationId
);
//got rid of adventure^^
router.all('/destinations/:id/adventures', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
);
//finished get by id
router.get('/adventures/:id(\\d+)', adventureController.getById);
//finished patch
router.patch('/adventures/:id(\\d+)', adventureController.update);
//finished delete
router.delete('/adventures/:id(\\d+)', adventureController.delete);
router.all('/adventures/:id(\\d+)', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PATCH', 'DELETE']))
);
//error pahts

module.exports = router;
