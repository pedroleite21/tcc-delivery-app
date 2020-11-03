const express = require('express');
const { authJwt } = require('../middleware');
const controller = require('../controllers/restaurant.controller');

module.exports = (app) => {
  const router = express.Router();

  router.post(
    '/',
    [authJwt.verifyTokens, authJwt.isAdmin],
    controller.createUpdate,
  );

  router.get(
    '/',
    [authJwt.verifyTokens],
    controller.getRestaurantInfo,
  );

  app.use('/api/restaurant', router);
};
