const express = require('express');
const products = require('../controllers/product.controller');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', products.createProduct);

  router.get('/', products.findAll);

  router.get('/:id', products.findOne);

  app.use('/api/products', router);
};
