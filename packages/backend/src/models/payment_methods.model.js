module.exports = (sequelize, Sequelize) => {
  const Payments = sequelize.define('payments', {
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
  });

  return Payments;
};
