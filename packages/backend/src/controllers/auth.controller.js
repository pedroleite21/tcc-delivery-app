const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const Role = db.role;

const { Op } = db.Sequelize;

exports.signup = (req, res) => {
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      user.setRoles([1]).then(() => {
        res.send({ message: 'User was registered successfully!' });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
