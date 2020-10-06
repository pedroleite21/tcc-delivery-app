const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');

const User = db.user;

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
    req.userId = decoded.id;
    next();
  });
}

module.exports = {
  verifyTokens,
};
