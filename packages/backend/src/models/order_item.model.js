module.exports = (sequelize, Sequelize) => {
  const OrdemItem = sequelize.define('order_item', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
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
