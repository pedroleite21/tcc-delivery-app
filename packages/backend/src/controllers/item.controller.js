const db = require('../models');

const Product = db.products;

exports.createProduct = (req, res) => {
  if (!req.body.name && !req.body.categoryId) {
    res.status(400).send({
      message: 'Product name and categoryId cannot be empty!',
    });
    return;
  }

  const product = {
    basePrice: req.body.basePrice,
    categoryId: req.body.categoryId,
    description: req.body.description,
    name: req.body.name,
  };

  Product.create(product)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while creating the Product',
      });
    });
};

exports.findAll = (req, res) => {
  Product.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occured while retrieving categories',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Product.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Product with id ${id}`,
      });
    });
};
