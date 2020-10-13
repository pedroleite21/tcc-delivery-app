const db = require('../models');

const Item = db.items;

exports.createItem = (req, res) => {
  if (!req.body.name && !req.body.categoryId) {
    res.status(400).send({
      message: 'Item name and categoryId cannot be empty!',
    });
    return;
  }

  const item = {
    basePrice: req.body.basePrice,
    categoryId: req.body.categoryId,
    description: req.body.description,
    name: req.body.name,
  };

  Item.create(item)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while creating the Item',
      });
    });
};

exports.findAll = (req, res) => {
  Item.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occured while retrieving items',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Item.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: 'Item not found',
        });
      }

      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Item with id ${id}`,
      });
    });
};
