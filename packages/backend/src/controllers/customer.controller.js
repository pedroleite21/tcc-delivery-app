const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const db = require('../models');

const Customer = db.customers;
const Address = db.addresses;
const Order = db.orders;

exports.findAll = (req, res) => {
  Customer.findAll({
    attributes: {
      exclude: ['password'],
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occured while retrieving the customers',
      });
    });
};

exports.create = (req, res) => {
  if (!req.body.name && !req.body.email && !req.body.password) {
    res.status(400).send({
      message: 'Fields cannot be empty!',
    });
  }

  const costumer = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };

  Customer.create(costumer)
    .then((data) => {
      const costumerData = data.get();

      const token = jwt.sign(
        { id: costumerData.id, email: costumerData.email },
        config.secret,
        {
          expiresIn: 86400,
        },
      );

      res.send({
        accessToken: token,
        id: costumerData.id,
        message: 'Customer created!',
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error on creating Customer',
      });
    });
};

exports.signIn = (req, res) => {
  Customer.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((customer) => {
      if (!customer) {
        return res
          .status(404)
          .send({ message: 'Customer Not Found' });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        customer.password,
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          message: 'Invalid Password!',
          accessToken: null,
        });
      }

      const token = jwt.sign(
        { id: customer.id, email: customer.email },
        config.secret,
        {
          expiresIn: 86400,
        },
      );

      return res.status(200).send({
        id: customer.id,
        accessToken: token,
      });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.refreshToken = (req, res) => {
  const { id } = req.body;

  Customer.findByPk(id)
    .then((customer) => {
      if (!customer) {
        return res.status(404).send({
          message: 'Customer Not Found',
          accessToken: null,
        });
      }

      const token = jwt.sign(
        { id: customer.id, email: customer.email },
        config.secret,
        {
          expiresIn: 86400,
        },
      );

      return res.status(200).send({
        id: customer.id,
        accessToken: token,
      });
    })
    .catch((error) => {
      res.status(404).send({
        message: error.message,
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Customer.findByPk(id)
    .then((data) => {
      const filterData = data.get();
      delete filterData.password;
      res.send(filterData);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Customer with id ${id}`,
      });
    });
};

exports.findOrdersById = (req, res) => {
  const { id } = req.params;

  Order.findAll({
    where: {
      customerId: id,
    },
    order: [['createdAt', 'DESC']],
  })
    .then((data) => {
      res.send(data);
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
