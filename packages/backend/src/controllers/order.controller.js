const db = require('../models');

const Orders = db.orders;
const Item = db.items;

exports.create = (req, res) => {
  const order = {
    acceptedBy: 'sania',
    value: '25.00',
    customerId: 1,
  };

  Orders.create(order)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while creating the Order',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Orders.findByPk(id, {
    include: Item,
  })
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Order with id ${id}`,
      });
    });
};
