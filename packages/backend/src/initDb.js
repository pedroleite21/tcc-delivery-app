const bcrypt = require('bcryptjs');
const db = require('./models');

const User = db.user;
const Payments = db.payments;

const ROLE_ADMIN = 'admin';

function createAdminUser() {
  User.create({
    email: process.env.ADMIN_EMAIL,
    name: 'Administrador - Restaurante',
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

function populatePaymentMethods() {
  Payments.create({
    name: 'Dinheiro',
  });

  Payments.create({
    name: 'Elo - Débito',
  });

  Payments.create({
    name: 'Elo - Crédito',
  });

  Payments.create({
    name: 'Visa - Débito',
  });

  Payments.create({
    name: 'Visa - Crédito',
  });

  Payments.create({
    name: 'Mastercard - Débito',
  });

  Payments.create({
    name: 'Mastercard - Crédito',
  });
}

module.exports = {
  createAdminUser,
  populatePaymentMethods,
};
