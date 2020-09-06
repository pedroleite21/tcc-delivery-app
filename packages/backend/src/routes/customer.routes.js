const express = require('express');
const customers = require('../controllers/customer.controller');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', customers.create);

  router.get('/:id', customers.findOne);

  router.get('/:id/orders', customers.findOrdersById);

  app.use('/api/customers', router);
};
