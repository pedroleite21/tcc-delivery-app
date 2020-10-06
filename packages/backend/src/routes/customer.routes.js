const express = require('express');
const customers = require('../controllers/customer.controller');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', customers.create);

  router.get('/:id', customers.findOne);

  router.get('/:id/orders', customers.findOrdersById);

  router.get('/:id/addresses', customers.findAddressesById);

  router.post('/:id/addresses', customers.createAddress);

  router.delete('/:id/addresses/:addressId', customers.deleteAddress);

  app.use('/api/customers', router);
};
