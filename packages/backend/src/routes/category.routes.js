const express = require('express');
const categories = require('../controllers/category.controller');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', categories.create);

  router.get('/', categories.findAll);

  router.get('/:id', categories.findOne);

  router.get('/:id/items', categories.findItemsById);

  app.use('/api/categories', router);
};
