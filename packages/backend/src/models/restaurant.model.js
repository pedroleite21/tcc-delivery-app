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
    closesAt: {
      type: Sequelize.TIME,
      allowNull: false,
    },
  });

  return Restaurant;
};
