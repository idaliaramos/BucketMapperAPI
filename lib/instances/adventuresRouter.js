// const express = require('express');
// const Boom = require('boom');
// const router = express.Router();
//
// const adventuresController = require('./adventureController');
//
// router.post('user/1/adventures', adventureController.create);
// router.get('user/1/adventures', adventureController.getAll);
// // router.all('user/1/adventures', (request, response, next) =>
// //   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
// // );
//
// router.get('/adventures/:id(\\d+)', adventureController.getById);
// router.patch('/adventures/:id(\\d+)', adventureController.update);
// router.delete('/adventures/:id(\\d+)', adventureController.delete);
//
// // router.all('/adventures/:id(\\d+)', (request, response, next) =>
// //   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PATCH', 'DELETE']))
// // );
// //error pahts
//
// module.exports = router;
