const express = require('express');
const items = require('../controllers/item.controller');
const { authJwt } = require('../middleware');

module.exports = (app) => {
  const router = express.Router();

  router.post(
    '/',
    [authJwt.verifyTokens, authJwt.isAdmin],
    items.createItem,
  );

  router.get('/', [authJwt.verifyTokens], items.findAll);

  router.get('/featured', [authJwt.verifyTokens], items.findFeatured);

  router.get('/:id', [authJwt.verifyTokens], items.findOne);

  app.use('/api/items', router);
};
