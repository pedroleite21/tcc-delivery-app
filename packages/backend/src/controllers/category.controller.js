const db = require('../models');

const Category = db.categories;
// const { Op } = db.sequelize;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: 'Category name cannot be empty!',
    });
    return;
  }

  const category = {
    name: req.body.name,
  };

  Category.create(category, { fields: ['name'] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while creating the Category',
      });
    });
};

exports.findAll = (req, res) => {
  Category.findAll()
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

  Category.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Category with id ${id}`,
      });
    });
};

exports.findItemsById = (req, res) => {
  const { id } = req.params;

  Category.findByPk(id, { include: ['items'] })
    .then((data) => {
      res.send(data.items);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving items for the Category with id ${id}`,
      });
    });
};

// exports.update = (req, res) => {
//   const { id } = req.params;

//   Category.update(req.body, {
//     where
//   })
// };
