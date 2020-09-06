const db = require('../models');

const Customer = db.customers;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: 'Customer name cannot be empty',
    });
  }

  const costumer = {
    name: req.body.name,
  };

  Customer.create(costumer)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error on creating Customer',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Customer.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Customer with id ${id}`,
      });
    });
};

exports.findOrdersById = (req, res) => {
  const { id } = req.params;

  Customer.findByPk(id, { include: ['orders'] })
    .then((data) => {
      res.send(data.orders);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Orders by Customer with id ${id}`,
      });
    });
};
