module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define('item', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    basePrice: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: '0.00',
    },
    featured: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
  });

  return Item;
};
