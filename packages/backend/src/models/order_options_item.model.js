module.exports = (sequelize, Sequelize) => {
  const OrderOptionsItem = sequelize.define('order_option_item', {
    unitValue: {
      defaultValue: 1,
      type: Sequelize.INTEGER,
    },
    quantity: {
      allowNull: false,
      defaultValue: 1,
      type: Sequelize.INTEGER,
    },
  });

  return OrderOptionsItem;
};
