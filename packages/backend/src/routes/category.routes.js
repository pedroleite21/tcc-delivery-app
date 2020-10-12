const express = require('express');
const categories = require('../controllers/category.controller');
const { authJwt } = require('../middleware');

module.exports = (app) => {
  const router = express.Router();

  router.post(
    '/',
    [authJwt.verifyTokens, authJwt.isAdmin],
    categories.create,
  );

  router.get('/', [authJwt.verifyTokens], categories.findAll);

  router.get('/:id', [authJwt.verifyTokens], categories.findOne);

  router.get(
    '/:id/items',
    [authJwt.verifyTokens],
    categories.findItemsById,
  );

  router.put(
    '/:id',
    [authJwt.verifyTokens, authJwt.isAdmin],
    categories.update,
  );

  app.use('/api/categories', router);
};
