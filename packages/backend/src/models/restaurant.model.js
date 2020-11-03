module.exports = (sequelize, Sequelize) => {
  const Restaurant = sequelize.define('restaurant', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    opensAt: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    minimum_order: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: '0.00',
    },
    closesAt: {
      type: Sequelize.TIME,
      allowNull: false,
    },
  });

  return Restaurant;
};
