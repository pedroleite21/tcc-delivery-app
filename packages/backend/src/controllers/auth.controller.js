const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;

const ROLE_MODERATOR = 'moderator';

exports.signup = (req, res) => {
  if (!req.body.email && !req.body.password) {
    return res
      .status(400)
      .send({ message: 'Missing required fields' });
  }

  return User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: ROLE_MODERATOR,
  })
    .then(() => {
      res.status(200).send({
        message: 'Moderator created with success',
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      const isValidPassword = bcrypt.compareSync(
        req.body.password,
        user.password,
      );

      if (!isValidPassword) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.secret,
        {
          expiresIn: 86400, // 24 hours
        },
      );

      return res.status(200).send({
        id: user.id,
        email: user.email,
        role: user.role,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(400).send({
        message: `Error ${err.message}`,
      });
    });
};

exports.refreshToken = (req, res) => {
  const { id } = req.body;

  User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
          accessToken: null,
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.secret,
        {
          expiresIn: 86400,
        },
      );

      return res.status(200).send({
        id: user.id,
        accessToken: token,
      });
    })
    .catch((error) => {
      res.status(404).send({
        message: error.message,
      });
    });
};
