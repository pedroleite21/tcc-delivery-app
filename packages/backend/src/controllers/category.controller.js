const db = require('../models');

const Category = db.categories;
const Items = db.items;

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

exports.update = (req, res) => {
  const { id } = req.params;

  Category.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (num[0] === 1) {
        res.send({
          message: 'Category was updated successfully.',
        });
      } else {
        res.status(400).send({
          message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Category with id=${id}`,
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
      if (!data) {
        return res.status(404).send({
          message: 'Category not found',
        });
      }

      return res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Category with id ${id}`,
      });
    });
};

exports.findItemsById = (req, res) => {
  const { id } = req.params;

  Items.findAll({
    where: {
      categoryId: id,
    },
    order: [['name', 'ASC']],
  })
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving items for the Category with id ${id}`,
      });
    });
};
