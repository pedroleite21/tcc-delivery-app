module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define('product', {
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    basePrice: {
      type: Sequelize.DECIMAL(5, 2),
    },
  });

  return Category;
};
