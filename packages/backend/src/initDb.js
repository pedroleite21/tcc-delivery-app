const bcrypt = require('bcryptjs');
const db = require('./models');

const User = db.user;

const ROLE_ADMIN = 'admin';

function createAdminUser() {
  User.create({
    email: process.env.ADMIN_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
    role: ROLE_ADMIN,
  })
    .then(() => {
      console.log('Admin registered');
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}

module.exports = {
  createAdminUser,
};
