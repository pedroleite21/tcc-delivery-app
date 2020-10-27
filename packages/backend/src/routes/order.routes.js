const express = require('express');
const orders = require('../controllers/order.controller');
const { authJwt } = require('../middleware');

module.exports = (app, socket) => {
  const router = express.Router();

  router.post(
    '/',
    [authJwt.verifyTokens, authJwt.isCostumer],
    (...args) => orders.create(...args, socket),
  );

  router.get('/:id', [authJwt.verifyTokens], orders.findOne);

  router.put(
    '/status/:id',
    [authJwt.verifyTokens, authJwt.isAdminOrModerator],
    (...args) => orders.updateStatus(...args, socket),
  );

  app.use('/api/orders', router);
};
