const express = require('express');
const orders = require('../controllers/order.controller');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', orders.create);

  router.get('/:id', orders.findOne);

  router.put('/status/:id', orders.updateStatus);

  app.use('/api/orders', router);
};
