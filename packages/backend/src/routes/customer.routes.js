const express = require('express');
const customers = require('../controllers/customer.controller');
const { verifySignUp, authJwt } = require('../middleware');

module.exports = (app) => {
  const router = express.Router();

  router.post(
    '/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail],
    customers.create,
  );

  router.post('/signin', customers.signIn);

  router.post('/refreshtoken', customers.refreshToken);

  router.get(
    '/',
    [authJwt.verifyTokens, authJwt.isAdminOrModerator],
    customers.findAll,
  );

  router.get('/:id', [authJwt.verifyTokens], customers.findOne);

  router.get(
    '/:id/orders',
    [authJwt.verifyTokens],
    customers.findOrdersById,
  );

  router.get(
    '/:id/addresses',
    [authJwt.verifyTokens],
    customers.findAddressesById,
  );

  router.post(
    '/:id/addresses',
    [authJwt.verifyTokens, authJwt.isCostumer],
    customers.createAddress,
  );

  router.delete(
    '/:id/addresses/:addressId',
    [authJwt.verifyTokens, authJwt.isCostumer],
    customers.deleteAddress,
  );

  app.use('/api/customers', router);
};
