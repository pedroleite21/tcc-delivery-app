const db = require('../models');

const Customer = db.customers;
const Address = db.addresses;

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

exports.findAddressesById = (req, res) => {
  const { id } = req.params;

  Customer.findByPk(id, {
    include: 'addresses',
    order: [
      ['addresses', 'primary', 'DESC'],
      ['addresses', 'name', 'ASC'],
    ],
  })
    .then((data) => {
      res.send(data.addresses);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Addresses by Customer with id ${id}`,
      });
    });
};

exports.createAddress = (req, res) => {
  const { id } = req.params;

  const address = {
    customerId: id,
    name: req.body.name,
    primary: req.body.primary,
    address_1: req.body.address_1,
    address_2: req.body.address_2,
    locality: req.body.locality,
  };

  // eslint-disable-next-line eqeqeq
  if (address.primary == true || address.primary == 1) {
    Address.findAll({
      where: {
        primary: true,
        customerId: id,
      },
    })
      .then((data) => {
        data.forEach((addressInstance) => {
          addressInstance.update({
            primary: false,
          });
        });
      })
      .catch(() => {
        res.status(500).send({
          message: 'Some error ocurred while creating Address',
        });
      });
  }

  Address.create(address)
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Some error ocurred while creating Address',
      });
    });
};

exports.deleteAddress = (req, res) => {
  const { id, addressId } = req.params;

  Address.destroy({
    where: {
      id: addressId,
      customerId: id,
    },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'Address was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Address with id=${addressId}. Maybe Address was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Could not delete Tutorial with id=${id}`,
      });
    });
};

exports.updateAddress = (req, res) => {
  const { id, addressId } = req.params;
  const { primary } = req.body;

  if (primary && primary === true) {
    Address.findAll({
      where: {
        primary: true,
        customerId: id,
      },
    })
      .then((data) => {
        data.forEach((addressInstance) => {
          addressInstance.update({
            primary: false,
          });
        });
      })
      .catch(() => {
        res.status(500).send({
          message: 'Some error ocurred while updating Address',
        });
      });
  }

  Address.destroy({
    where: {
      id: addressId,
      customerId: id,
    },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'Address was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Address with id=${addressId}. Maybe Address was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Could not delete Tutorial with id=${id}`,
      });
    });
};
