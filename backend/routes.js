const { Router } = require('express');
const routes = Router();
const R6PlayerController = require('./controllers/R6PlayerController');
const ApexPlayerController = require('./controllers/ApexPlayerController');
const UserController = require('./controllers/UserController');

routes.post('/r6players', R6PlayerController.store);
routes.get('/r6players', R6PlayerController.index);

routes.post('/apexplayers', ApexPlayerController.store);
routes.get('/apexplayers', ApexPlayerController.index);

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

module.exports = routes;
