module.exports = (sequelize, Sequelize) => {
  const ItemOption = sequelize.define('item_option', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    position: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: 'single',
    },
    required: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    minItems: {
      type: Sequelize.INTEGER,
    },
    maxItems: {
      type: Sequelize.INTEGER,
    },
  });

  return ItemOption;
};
