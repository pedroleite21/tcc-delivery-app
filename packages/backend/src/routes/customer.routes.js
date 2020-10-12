const express = require('express');
const customers = require('../controllers/customer.controller');
const { verifySignUp, authJwt } = require('../middleware');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  const router = express.Router();

  router.post(
    '/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail],
    customers.create,
  );

  router.post('/signin', customers.signIn);

  router.post('/refreshtoken', customers.refreshToken);

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
    [authJwt.verifyTokens],
    customers.createAddress,
  );

  router.delete(
    '/:id/addresses/:addressId',
    [authJwt.verifyTokens],
    customers.deleteAddress,
  );

  app.use('/api/customers', router);
};
