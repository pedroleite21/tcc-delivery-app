const express = require('express');
const payments = require('../controllers/payment.controller');
const { authJwt } = require('../middleware');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', [authJwt.verifyTokens], payments.findAll);

  app.use('/api/payments', router);
};
