const { Router } = require('express');
const routes = Router();
const PlayerController = require('./controllers/PlayerController');

// index, show, store, update, destroy

routes.post('/players', PlayerController.store);
routes.get('/players', PlayerController.index);

module.exports = routes;
