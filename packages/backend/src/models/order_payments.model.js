module.exports = (sequelize, Sequelize) => {
  const OrderOptionsItem = sequelize.define('order_payment', {
    change: {
      defaultValue: '0.00',
      type: Sequelize.DECIMAL(5, 2),
    },
  });

  return OrderOptionsItem;
};
