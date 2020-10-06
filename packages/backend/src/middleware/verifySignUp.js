/**
 * Verify if `email` it's duplicated
 */
const db = require('../models');

const { ROLES, user: User } = db;

function checkDuplicateUsernameOrEmail(req, res, next) {
  // Email
  User.findOne({
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

function checkRolesExisted(req, res, next) {
  if (req.body.roles) {
    req.body.roles.forEach((role) => {
      if (ROLES.indexOf(role) === -1) {
        res.status(400).send({
          message: `Failed! Role does not exist = ${role}`,
        });
      }
    });
  }

  next();
}

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
