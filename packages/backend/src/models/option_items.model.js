module.exports = (sequelize, Sequelize) => {
  const OptionItem = sequelize.define('option_item', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    addPrice: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: '0.00',
    },
    paused: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
  });

  return OptionItem;
};
