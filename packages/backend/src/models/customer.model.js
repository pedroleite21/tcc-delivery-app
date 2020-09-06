module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define('customer', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Customer;
};
