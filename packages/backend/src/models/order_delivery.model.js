module.exports = (sequelize, Sequelize) => {
  const OrderDelivery = sequelize.define('order_delivery', {
    takeout: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return OrderDelivery;
};
