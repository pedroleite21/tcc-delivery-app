const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');

const User = db.user;
const Costumer = db.customers;

// eslint-disable-next-line consistent-return
function verifyTokens(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unathorized!',
      });
    }
    req.body.userId = decoded.id;
    req.body.userEmail = decoded.email;
    next();
  });
}

function isCostumer(req, res, next) {
  Costumer.findByPk(req.body.userId).then((user) => {
    if (user) {
      return next();
    }

    return res.status(403).send({
      message: 'Are you a costumer?',
    });
  });
}

function isAdmin(req, res, next) {
  User.findByPk(req.body.userId).then((user) => {
    if (user.role !== 'admin') {
      return res.status(403).send({
        message: 'Require Admin Role!',
      });
    }
    return next();
  });
}

function isAdminOrModerator(req, res, next) {
  User.findByPk(req.body.userId).then((user) => {
    if (user.role === 'admin' || user.role === 'moderator') {
      return next();
    }

    return res.status(403).send({
      message: 'Require Admin or moderator Role!',
    });
  });
}

module.exports = {
  verifyTokens,
  isAdmin,
  isAdminOrModerator,
  isCostumer,
};
