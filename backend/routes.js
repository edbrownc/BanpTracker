const { Router } = require('express');
const { check } = require('express-validator');
const routes = Router();
const R6PlayerController = require('./controllers/R6PlayerController');
const ApexPlayerController = require('./controllers/ApexPlayerController');
const UserController = require('./controllers/UserController');

// R6 Routes
routes.post(
  '/r6players',
  [check('username').isEmpty(), check('uplay_name').isEmpty()],
  R6PlayerController.store
);
routes.get('/r6players', R6PlayerController.index);

// Apex Routes
routes.post(
  '/apexplayers',
  [check('username').isEmpty(), check('origin_name').isEmpty()],
  ApexPlayerController.store
);
routes.get('/apexplayers', ApexPlayerController.index);

// Users routes
routes.post(
  '/users',
  [
    check('email').isEmail(),
    check('username').isEmpty(),
    check('name').isEmpty()
  ],
  UserController.store
);
routes.get('/users', UserController.index);
routes.put('/users', [check('username').isEmpty()], UserController.update);
routes.delete('/users', UserController.destroy);

module.exports = routes;
