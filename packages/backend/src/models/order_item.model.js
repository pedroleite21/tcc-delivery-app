module.exports = (sequelize, Sequelize) => {
  const OrdemItem = sequelize.define('order_item', {
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

  return OrdemItem;
};
