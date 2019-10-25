const express = require('express');

const ClientController = require('./app/controllers/ClientController');
const AttendantController = require('./app/controllers/AttendantController');
const SaleController = require('./app/controllers/SaleController');

const routes = express.Router();

routes.post('/clients', ClientController.store);
routes.get('/clients', ClientController.index);

routes.post('/attendants', AttendantController.store);
routes.get('/attendants', AttendantController.index);

routes.post('/sales', SaleController.store);
routes.get('/sales', SaleController.index);

module.exports = routes;
