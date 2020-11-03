/**
 * Verify if `email` it's duplicated
 */
const db = require('../models');

const { customers: Customers, user: Users } = db;

function checkDuplicateUsernameOrEmail(req, res, next) {
  // Email
  Customers.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Failed! Email is already in use!',
      });
      return;
    }

    next();
  });
}

function checkUserDuplicateUsernameOrEmail(req, res, next) {
  // Email
  Users.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Failed! Email is already in use!',
      });
      return;
    }

    next();
  });
}

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkUserDuplicateUsernameOrEmail,
};
