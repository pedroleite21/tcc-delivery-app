const express = require('express');
const items = require('../controllers/item.controller');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', items.createItem);

  router.get('/', items.findAll);

  router.get('/:id', items.findOne);

  app.use('/api/items', router);
};
