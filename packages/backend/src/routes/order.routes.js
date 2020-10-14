const express = require('express');
const orders = require('../controllers/order.controller');
const { authJwt } = require('../middleware');

module.exports = (app) => {
  const router = express.Router();

  router.post(
    '/',
    [authJwt.verifyTokens, authJwt.isCostumer],
    orders.create,
  );

  router.get('/:id', orders.findOne);

  router.put('/status/:id', orders.updateStatus);

  app.use('/api/orders', router);
};
