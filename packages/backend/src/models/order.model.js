module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('order', {
    acceptedBy: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'awaiting_confirmation',
    },
    value: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    },
  });

  return Order;
};
